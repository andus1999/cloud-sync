import React from 'react';
import { Card, Grid, Typography, Stack, List, ListItem, ListItemIcon, ListItemText, Switch, useButton, Button, Fab } from '@mui/material'
import { useRouter } from 'next/router';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import CloudIcon from '@mui/icons-material/Cloud';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AddDeviceDialog from '../NetworkOverview/AddDeviceDialog';
import AddIcon from '@mui/icons-material/Add';


export interface NetworkInfo {
  email: string,
  networkId: string,
  password: string,
  name: string,
  refresh_token: string,
}

export default function NetworkDashboard() {
  const [networkInfo, setNetworkInfo] = React.useState<NetworkInfo | null>(null);
  const [devices, setDevices] = React.useState<any | null>(null);
  const router = useRouter();
  const { networkId } = router.query;
  const db = getDatabase();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const db = getDatabase();
    const networkRef = ref(db, 'networks/' + networkId);

    const unsub = onValue(networkRef, (snapshot) => {
      const val = snapshot.val();
      setNetworkInfo({ ...val.info, networkId: networkId })
      setDevices(val.devices)
    })

    return () => unsub();
  }, [networkId])

  const handleToggle = (device: string, key: string) => {
    const currentValue = devices?.[device]?.cloud_state?.[key];
    const valueRef = ref(db, `networks/${networkId}/devices/${device}/cloud_state/${key}`);
    set(valueRef, currentValue != 1 ? 1 : 0);
  }

  const listItems = devices ? Object.keys(devices).map((it) => (<ListItem key={it}>
    <ListItemIcon>
      {devices[it].local_state?.pin_0 == 1 ? <LightbulbIcon /> : <LightbulbOutlinedIcon />}
    </ListItemIcon>
    <ListItemText primary="Led" />
    <Switch
      edge="end"
      onChange={() => handleToggle(it, 'pin_0')}
      checked={devices[it]?.cloud_state?.pin_0 == 1}
      inputProps={{
        'aria-labelledby': 'switch-list-label-bluetooth',
      }}
    />
  </ListItem>)) : []

  const numberOfDevices = devices ? Object.keys(devices).length : null;
  const numberOfLedsWithButton = devices ? Object.keys(devices).filter(
    (it) => devices[it].device_info.hardware_id == 'led_with_button').length : null;

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
                {numberOfDevices ? <ListItem>
                  <ListItemIcon>
                    <DevicesOtherIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Registered devices: ${numberOfDevices}`} />
                </ListItem>
                  : <ListItem>
                    <ListItemIcon>
                      <DevicesOtherIcon />
                    </ListItemIcon>
                    <ListItemText primary={"No devices added."} />
                  </ListItem>}
                {numberOfLedsWithButton && <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon />
                  </ListItemIcon>
                  <ListItemText primary={`Leds with Button: ${numberOfLedsWithButton}`} />
                </ListItem>}
              </List>
            </Card>
          </Grid>
        </Grid>
        <Typography variant='h5' textAlign='left'>
          Devices
        </Typography>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item md={6} xs={12}>
            <Card sx={{ padding: '20px', height: '100%' }}>
              <List>
                {listItems.length != 0 ? listItems : <ListItem>
                  <ListItemIcon>
                    <DevicesOtherIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Add your first device."} />
                </ListItem>}
              </List>
            </Card>
          </Grid>
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
