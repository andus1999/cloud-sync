import { Button, Card, Grid, ListItemIcon, ListItemText, Stack, Typography, List, Switch, ListItem } from '@mui/material';
import { get, getDatabase, onValue, ref, set } from 'firebase/database';
import React from 'react';
import AddDeviceDialog from './AddDeviceDialog';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

export interface NetworkData {
  name: string,
  refresh_token: string,
  network_id: string,
  devices: any,
}

export interface NetworkSnapshot {
  networkId: string,
  permissions: string,
}

export default function NetworkCard({ networkSnapshot }: { networkSnapshot: NetworkSnapshot }) {
  const [networkData, setNetworkData] = React.useState<NetworkData | null>(null);
  const [valid, setValid] = React.useState(false);
  const [open, setOpen] = React.useState(false);


  const db = getDatabase();
  const networkId = networkSnapshot.networkId;


  React.useEffect(() => {
    const networkRef = ref(db, 'networks/' + networkId);

    onValue(networkRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        setNetworkData({ ...snapshot.val(), network_id: networkId })
        setValid(true);
      } else {
        console.log("No data available");
      }
    })
  }, [db, networkId])

  const handleToggle = (device: string, key: string) => {
    const currentValue = networkData?.devices?.[device]?.cloud_state?.[key];
    const valueRef = ref(db, `networks/${networkId}/devices/${device}/cloud_state/${key}`);
    set(valueRef, currentValue != 1 ? 1 : 0);
  }

  const listItems = networkData?.devices ? Object.keys(networkData?.devices).map((it) => (<ListItem key={it}>
    <ListItemIcon>
      {networkData?.devices[it].local_state?.pin_0 == 1 ? <LightbulbIcon /> : <LightbulbOutlinedIcon />}
    </ListItemIcon>
    <ListItemText primary="Led" />
    <Switch
      edge="end"
      onChange={() => handleToggle(it, 'pin_0')}
      checked={networkData?.devices[it].cloud_state?.pin_0 == 1}
      inputProps={{
        'aria-labelledby': 'switch-list-label-bluetooth',
      }}
    />
  </ListItem>)) : []

  return <Grid item md={6} xs={12}>
    <Card sx={{ height: '100%', padding: '50px' }}>
      {networkData && <AddDeviceDialog open={open} setOpen={setOpen} networkData={networkData} />}
      {networkData && <Stack gap='40px' alignItems='center' justifyContent='space-between' height='100%'>
        <Typography variant='h4'>
          {networkData.name}
        </Typography>
        <List>{listItems}</List>
        <Button onClick={() => setOpen(true)} sx={{ width: '100%' }}>
          Add device
        </Button>
      </Stack>}
    </Card>
  </Grid>;
}
