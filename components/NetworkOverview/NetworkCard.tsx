import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import React from 'react';
import AddDeviceDialog from './AddDeviceDialog';

export interface NetworkData {
  name: string,
  refresh_token: string,
  network_id: string,
}

export interface NetworkSnapshot {
  networkId: string,
  permissions: string,
}

export default function NetworkCard({ networkSnapshot }: { networkSnapshot: NetworkSnapshot }) {
  const [networkData, setNetworkData] = React.useState<NetworkData | null>(null);
  const [valid, setValid] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const db = getDatabase();
    const networkId = networkSnapshot.networkId;
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
  }, [networkSnapshot])

  return <Grid item md={6} xs={12}>
    <Card sx={{ height: '100%', padding: '50px' }}>
      {networkData && <AddDeviceDialog open={open} setOpen={setOpen} networkData={networkData} />}
      {networkData && <Stack gap='40px' alignItems='center' justifyContent='space-between' height='100%'>
        <Typography variant='h4'>
          {networkData.name}
        </Typography>
        <Typography variant='body1' sx={{ wordBreak: 'break-word' }}>
          {networkData.network_id}
        </Typography>
        <Button onClick={() => setOpen(true)} sx={{ width: '100%' }}>
          Add device
        </Button>
      </Stack>}
    </Card>
  </Grid>;
}
