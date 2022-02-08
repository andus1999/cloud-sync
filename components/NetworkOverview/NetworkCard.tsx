import { Button, Card, Grid, ListItemIcon, ListItemText, Divider, Stack, Typography, List, Switch, ListItem, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
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
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';

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
  const [name, setName] = React.useState("");
  const [renameOpen, setRenameOpen] = React.useState(false);

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

  const rename = () => {
    const nameRef = ref(db, `networks/${networkId}/info/name`)
    set(nameRef, name);
    setRenameOpen(false);
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    name && rename();
  }

  return <>
    <Dialog open={renameOpen} onClose={() => setRenameOpen(false)}>
      <Stack gap='20px' padding='20px' component='form' onSubmit={submit}>
        <DialogTitle>
          Rename the Network
        </DialogTitle>
        <DialogContent>
          <Stack gap='10px'>
            <Typography variant='body1'>
              {'The current name is ' + networkInfo?.name}
            </Typography>
            <TextField
              label='Network Name'
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>
            Cancel
          </Button>
          {name && <Button onClick={rename} type='submit'>
            Rename
          </Button>}
        </DialogActions>
      </Stack>
    </Dialog>

    <Grid item md={6} xs={12}>
      <Card sx={{ height: '100%', padding: '50px' }}>
        {networkInfo && <AddDeviceDialog open={open} setOpen={setOpen} networkInfo={networkInfo} />}
        {networkInfo && <Stack gap='20px' justifyContent='space-between' height='100%'>
          <Stack direction='row' alignItems='center' justifyContent='space-between' width='100%'>
            <Typography variant='h5' textAlign='left'>
              {networkInfo.name}
            </Typography>
            <Stack direction='row'>
              <IconButton onClick={() => setRenameOpen(true)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={deleteNetwork}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
          <Divider sx={{ width: '100%' }} />
          <List>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary='Admin' secondary='You have admin access to this network.' />
            </ListItem>
          </List>
          <Stack direction='row' gap='10px' flexWrap='wrap' justifyContent='right' width='100%'>
            <Button onClick={() => setOpen(true)}>
              Add device
            </Button>
            <Button onClick={() => router.push(`/networks/${networkId}`)}>
              Dashboard
            </Button>
          </Stack>
        </Stack>}
      </Card>
    </Grid>
  </>;
}
