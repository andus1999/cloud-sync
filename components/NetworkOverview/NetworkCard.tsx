import { Button, Card, Grid, Typography } from '@mui/material';
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

  return <Grid item md={6}>
    <Card sx={{ padding: '5%' }}>
      {networkData && <AddDeviceDialog open={open} setOpen={setOpen} networkData={networkData} />}
      {networkData && <>
        <Typography variant='h4'>
          {networkData.name}
        </Typography>
        <Typography variant='body1'>
          {networkData.refresh_token}
        </Typography>
        <Button onClick={() => setOpen(true)}>
          Add device
        </Button>
      </>}
    </Card>
  </Grid>;
}
