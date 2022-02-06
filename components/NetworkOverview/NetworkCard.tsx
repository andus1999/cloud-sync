import { Button, Card, Grid, ListItemIcon, ListItemText, Stack, Typography, List, Switch, ListItem, IconButton } from '@mui/material';
import { get, getDatabase, onValue, ref, remove, set } from 'firebase/database';
import React from 'react';
import AddDeviceDialog from './AddDeviceDialog';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';
import { deleteUser, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useRouter } from 'next/router';

const config = {
  apiKey: "AIzaSyAhyAj4xZoz36pX5Fm4g-a8PnazteInyRQ",
  authDomain: "cloud-sync-iot.firebaseapp.com",
}

const networkApp = initializeApp(config, "network_app");

export interface NetworkInfo {
  email: string,
  networkId: string,
  password: string,
  name: string,
  refresh_token: string,
}

export interface NetworkSnapshot {
  networkId: string,
  permissions: string,
}

export default function NetworkCard({ networkSnapshot }: { networkSnapshot: NetworkSnapshot }) {
  const [networkInfo, setNetworkInfo] = React.useState<NetworkInfo | null>(null);
  const [open, setOpen] = React.useState(false);

  const router = useRouter();
  const db = getDatabase();
  const networkId = networkSnapshot.networkId;


  React.useEffect(() => {
    const networkRef = ref(db, 'networks/' + networkId + '/info');

    const unsub = onValue(networkRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val())
        setNetworkInfo({ ...snapshot.val(), networkId: networkId })
      } else {
        setNetworkInfo(null);
        console.log("No data available");
      }
    })
    return () => unsub();
  }, [db, networkId])

  const deleteNetwork = async () => {
    const auth = getAuth();
    const info = (await get(ref(db, 'networks/' + networkId + '/info'))).val()
    const networkAuth = getAuth(networkApp);
    await signInWithEmailAndPassword(networkAuth, info?.email, info?.password);
    try {
      if (!networkAuth.currentUser) throw new Error('Required');
      await deleteUser(networkAuth.currentUser);
    }
    catch {
      console.log("error during network login");
      return;
    }

    const networkRef = ref(db, 'networks/' + networkId);
    remove(networkRef);

    const userNetworkRef = ref(db, 'users/' + auth.currentUser?.uid + '/networks/' + networkId);
    remove(userNetworkRef);
  }

  return <Grid item md={6} xs={12}>
    <Card sx={{ height: '100%', padding: '50px' }}>
      {networkInfo && <AddDeviceDialog open={open} setOpen={setOpen} networkInfo={networkInfo} />}
      {networkInfo && <Stack gap='40px' alignItems='center' justifyContent='space-between' height='100%'>
        <Stack direction='row' gap='20px' alignItems='center'>
          <Typography variant='h5'>
            {networkInfo.name}
          </Typography>
          <IconButton onClick={deleteNetwork}>
            <DeleteIcon />
          </IconButton>
        </Stack>
        <Stack direction='row' gap='10px' flexWrap='wrap' justifyContent='center'>
          <Button onClick={() => setOpen(true)}>
            Add device
          </Button>
          <Button onClick={() => router.push(`/networks/${networkId}`)}>
            Dashboard
          </Button>
        </Stack>
      </Stack>}
    </Card>
  </Grid>;
}
