import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
  TextField, Stepper, Step,
  StepLabel, DialogActions, Button, circularProgressClasses, CircularProgress, Stack, Alert
} from '@mui/material';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { execPath } from 'process';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const config = {
  apiKey: "AIzaSyAhyAj4xZoz36pX5Fm4g-a8PnazteInyRQ",
  authDomain: "cloud-sync-iot.firebaseapp.com",
}

const networkApp = initializeApp(config, "network_app");

export default function CreateNetworkDialog({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [networkName, setNetworkName] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const createAccount = () => {
    setLoading(true);
    const auth = getAuth();
    const networkAuth = getAuth(networkApp);
    const userName = Date.now().toString() + '.' + auth.currentUser?.uid;
    const email = userName + '@cloud-sync-iot.web.app';
    const password = userName;
    const db = getDatabase();

    createUserWithEmailAndPassword(networkAuth, email, password)
      .then((userCredential) => {
        const nUid = userCredential.user.uid;
        const rToken = userCredential.user.refreshToken;
        signOut(networkAuth);
        set(
          ref(db, 'users/' + auth.currentUser?.uid + '/networks/' + nUid + '/permissions'),
          'admin');
        set(
          ref(db, 'networks/' + nUid),
          { name: networkName, refresh_token: rToken });
        setLoading(false);
        setSuccess(true);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.code);
      });
  }

  const handleClose = () => {
    setOpen(false);
  };

  return <div>
    <Dialog open={open} onClose={handleClose}>
      <Stack gap='40px' padding='5%'>
        <DialogTitle>Create a new Network</DialogTitle>
        <DialogContent>
          <Stack gap='40px'>
            {success ? <Alert severity='success'>
              {`Successfully created ${networkName}!`}
            </Alert> :
              <Alert severity='info'>
                Please enter a name for the new network
              </Alert>}
            {!success && <TextField
              label="Network name"
              onChange={(e) => setNetworkName(e.target.value)}
            />}
            {loading && <Stack alignItems='center'>
              <CircularProgress />
            </Stack>}
          </Stack>
        </DialogContent>
        {error && <Alert severity='error'>{error}</Alert>}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {networkName && !success && <Button onClick={createAccount}>Create</Button>}
          {success && <Button onClick={handleClose}>Close</Button>}
        </DialogActions>
      </Stack>
    </Dialog>
  </div >;
}
