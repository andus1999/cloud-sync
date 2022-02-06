import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Button } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import React, { FormEvent } from 'react';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';

export default function AddWiFiNetworkDialog({ open, setOpen }:
  {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  }) {
  const [name, setName] = React.useState("");
  const [ssid, setSsid] = React.useState("");
  const [pass, setPass] = React.useState("");

  const addNetwork = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    const db = getDatabase();
    set(ref(db, `users/${auth.currentUser?.uid}/wifi_networks/${name}`), { ssid, pass });
    setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return <>
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <Stack gap='20px' alignItems='center' padding='20px 3%' component='form' onSubmit={(e: FormEvent<HTMLFormElement>) => addNetwork(e)}>
        <Stack direction='row' alignItems='center'>
          <SignalWifiStatusbar4BarIcon />
          <DialogTitle>
            Add a WiFi Network
          </DialogTitle>
        </Stack>

        <DialogContent sx={{ width: '100%' }}>
          <Stack gap='20px'>
            <TextField
              defaultValue=""
              onChange={(e) => setName(e.target.value)}
              label='Unique Network Name'
              autoComplete='off'
            />
            <TextField
              defaultValue=""
              onChange={(e) => setSsid(e.target.value)}
              label='SSID'
              autoComplete='off'
            />
            <TextField
              defaultValue=""
              onChange={(e) => setPass(e.target.value)}
              label='Password'
              type='password'
              autoComplete='off'
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ width: '100%' }}>
          <Stack gap='20px' direction='row' alignItems='flex-end'>
            <Button onClick={handleClose}>Cancel</Button>
            {ssid && pass && <Button type='submit'>Add Network</Button>}
          </Stack>
        </DialogActions>
      </Stack>
    </Dialog>
  </>;
}
