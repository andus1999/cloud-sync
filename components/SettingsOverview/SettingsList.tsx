import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, Grid, Card, Fab, IconButton } from '@mui/material';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddWiFiNetworkDialog from './AddWiFiNetworkDialog';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, ref, remove } from 'firebase/database';

export default function SettingsList() {
  const [wifiOpen, setWifiOpen] = React.useState(false);
  const [wifiNetworks, setWifiNetworks] = React.useState<JSX.Element[]>([]);

  React.useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const networkRef = ref(db, `users/${auth.currentUser?.uid}/wifi_networks`);

    const deleteNetwork = (name: string) => {
      const nRef = ref(db, `users/${auth.currentUser?.uid}/wifi_networks/${name}`);
      remove(nRef);
    }

    const unsub = onValue(networkRef, (snapshot) => {
      const val = snapshot.val();
      console.log(val);
      if (!val) {
        setWifiNetworks([]);
        return;
      }
      const wifiNetworksList = Object.keys(val).map((it) =>
        <ListItem key={it} secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={() => { deleteNetwork(it); }}>
            <RemoveCircleIcon />
          </IconButton>
        }>
          <ListItemText primary={it} />
        </ListItem>)
      console.log(wifiNetworksList);
      setWifiNetworks(wifiNetworksList);
    });
    return () => unsub();
  }, [])


  return <>
    <AddWiFiNetworkDialog open={wifiOpen} setOpen={setWifiOpen} />
    <Stack width='100%' padding='0 5%' gap='30px'>
      <Typography variant='h5' textAlign='left'>
        General
      </Typography>
      <Card >
        <Grid container spacing={2} alignItems="stretch" padding='30px 3%'>
          <Grid item md={6} xs={12}>
            <Stack gap='10px'>
              <Stack direction='row' justifyContent='space-between' alignItems='center' padding='0 3%'>
                <Stack direction='row' gap='20px'>
                  <SignalWifiStatusbar4BarIcon />
                  <Typography variant='h6' textAlign='left'>
                    WiFi Networks
                  </Typography>
                </Stack>
                <Fab color="primary" aria-label="add" onClick={() => { setWifiOpen(true) }} size='small'>
                  <AddIcon />
                </Fab>
              </Stack>

              <Divider />
              <List>
                {wifiNetworks}
              </List>
              <Divider />
            </Stack>
          </Grid>
        </Grid >
      </Card >
    </Stack >
  </>
}
