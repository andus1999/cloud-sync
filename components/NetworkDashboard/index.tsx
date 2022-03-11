import React from 'react';
import { Card, Grid, Typography, Stack, List, ListItem, ListItemIcon, ListItemText, Switch, useButton, Button, Fab } from '@mui/material'
import { useRouter } from 'next/router';
import { getDatabase, increment, onValue, ref, set, update } from 'firebase/database';
import CloudIcon from '@mui/icons-material/Cloud';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AddDeviceDialog from '../NetworkOverview/AddDeviceDialog';
import AddIcon from '@mui/icons-material/Add';
import LightSwitch from './DeviceCard/LightSwitch';
import DeviceCard from './DeviceCard';
import { deviceNames } from '../../resources/Strings';
import deviceIcons from './deviceIcons';
import Values from '../../resources/Values';
import { Device } from '../../types/interfaces';


export interface NetworkInfo {
  email: string,
  networkId: string,
  password: string,
  name: string,
  refresh_token: string,
}

export default function NetworkDashboard() {
  const [networkInfo, setNetworkInfo] = React.useState<NetworkInfo | null>(null);
  const [devices, setDevices] = React.useState<{ [key: string]: Device } | null>(null);
  const [firstUpdate, setFirstUpdate] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const networkId = router.query.networkId as string;


  React.useEffect(() => {
    if (!devices) return;

    const requestUpdate = () => {
      console.log('Pinging devices')
      const db = getDatabase();
      const updates: { [key: string]: object | number } = {}
      Object.keys(devices).forEach((mac) => {
        if ((Date.now() / 1000 - devices[mac]?.localState?.heartbeat) > 5) {
          updates[`networks/${networkId}/devices/${mac}/cloud_state/update`] = Math.round(Date.now() / 1000)
        }
      })
      update(ref(db), updates);
    }

    if (firstUpdate) {
      requestUpdate();
      setFirstUpdate(false);
    }

    const interval = setInterval(requestUpdate, 15000);
    return () => clearInterval(interval);

  }, [devices, networkId, firstUpdate])


  React.useEffect(() => {
    const db = getDatabase();
    const networkRef = ref(db, 'networks/' + networkId + '/info');

    const unsub = onValue(networkRef, (snapshot) => {
      const val = snapshot.val();
      setNetworkInfo({ ...val, networkId: networkId })
    })
    return unsub;
  }, [networkId])


  React.useEffect(() => {
    const db = getDatabase();
    const networkRef = ref(db, 'networks/' + networkId + '/devices');

    const unsub = onValue(networkRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) return;
      const d: { [key: string]: Device } = {};
      Object.keys(val).forEach((mac) => {
        const data = val[mac];
        if (!data.info) return
        d[mac] = {
          localState: data.local_state,
          cloudState: data.cloud_state,
          info: {
            ...data.info,
            networkId,
            mac,
          }
        }
      })
      setDevices(d);
    })
    return unsub;
  }, [networkId])



  const deviceCards = devices ? Object.keys(devices).map((it) => (
    <DeviceCard key={it} device={devices[it]} />
  )) : []

  const deviceOnlineCounts: { [key: string]: number } = {}
  const deviceCounts: { [key: string]: number } = {}

  const numberOfDevices = devices ? Object.keys(devices).length : null
  let onlineDevices = 0;

  devices && Object.keys(devices).forEach((it) => {
    const key = devices[it].info.hardware_id
    deviceCounts[key]
      ? deviceCounts[key] += 1
      : deviceCounts[key] = 1;
    if ((Date.now() / 1000 - devices[it]?.localState?.heartbeat) < Values.heartbeatInterval) {
      deviceOnlineCounts[key]
        ? deviceOnlineCounts[key] += 1
        : deviceOnlineCounts[key] = 1;
      onlineDevices += 1;
    }
  })

  const deviceListItems = Object.keys(deviceCounts).map((it) => <ListItem key={it}>
    <ListItemIcon>
      {deviceIcons[it]}
    </ListItemIcon>
    <ListItemText primary={`${deviceOnlineCounts[it] || 0} / ${deviceCounts[it]} Online`} secondary={deviceNames[it]} />
  </ListItem>)



  return <>
    {networkInfo && <AddDeviceDialog open={open} setOpen={setOpen} networkInfo={networkInfo} />}
    <Stack gap='50px' alignItems='center'>
      <Stack direction='row' gap='40px' alignItems='center' padding='0 3%'>
        <CloudIcon fontSize='large' />
        <Typography variant='h4'>
          {networkInfo?.name}
        </Typography>
      </Stack>
      <Stack width='100%' padding='0 5%' gap='30px'>
        <Typography variant='h5' textAlign='left'>
          Overview
        </Typography>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item md={6} xs={12}>
            <Card sx={{ padding: '20px', height: '100%' }}>
              <List>
                {devices ? <>
                  <ListItem>
                    <ListItemIcon>
                      <DevicesOtherIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${onlineDevices} / ${numberOfDevices} Online`} secondary='Registered Devices' />
                  </ListItem>
                  {deviceListItems}
                </>
                  : <ListItem>
                    <ListItemIcon>
                      <DevicesOtherIcon />
                    </ListItemIcon>
                    <ListItemText primary={"No devices added."} />
                  </ListItem>}
              </List>
            </Card>
          </Grid>
        </Grid>
        <Typography variant='h5' textAlign='left'>
          Devices
        </Typography>
        <Grid container spacing={2} alignItems="stretch">
          {deviceCards}
        </Grid>
        <Stack direction='row' alignItems='center' justifyContent='right'>
          <Fab color="primary" aria-label="add" onClick={() => setOpen(true)}>
            <AddIcon />
          </Fab>
        </Stack>
      </Stack>
    </Stack>
  </>;
}
