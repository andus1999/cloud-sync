import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Stepper, Step,
  StepLabel, DialogActions, Button, CircularProgress,
  Stack, Alert, Typography, LinearProgress
} from '@mui/material';
import { NetworkData } from './NetworkCard';

enum State {
  Connecting,
  Connected,
}

const instructions: Array<string> = [];
instructions[State.Connecting] = "Please connect to the open WiFi access point of the device. Do not leave this site.";
instructions[State.Connected] = "Successfully connected to the device. Click continue to initialize the device.";

export default function AddDeviceDialog({ open, setOpen, networkData }:
  {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    networkData: NetworkData,
  }) {

  const [error, setError] = React.useState("");
  const [state, setState] = React.useState(State.Connecting);
  const [ssid, setSsid] = React.useState("A1-BED564");
  const [pass, setPass] = React.useState("5AUXYAQL4F");

  React.useEffect(() => {

    const timeout = () => {
      let controller = new AbortController();
      setTimeout(() => controller.abort(), 2000);
      return controller.signal;
    };

    let canceled = false;

    const ping = async () => {
      console.log("Start pinging.");

      if (!(networkData.refresh_token && networkData.network_id)) {
        setError("The network was not set up correctly.");
        return;
      }

      while (!canceled) {
        try {
          const res = await fetch("http://172.16.0.1", { signal: timeout() });
          console.log("Successful ping: " + res);
          setError("");
          setState(State.Connected);
          break;
        }
        catch (e) {
          console.log(e);
        }
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    if (!open)
      setState(State.Connecting);
    else {
      switch (state) {
        case State.Connecting:
          setError("");
          ping();
          break;
        case State.Connected:
          break;
      }
    }

    return () => { canceled = true; }

  }, [state, networkData.network_id, networkData.refresh_token, open]);

  const handleClose = () => {
    setOpen(false);
  };

  return <div>
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
      <Stack gap='40px' padding='5%'>
        <DialogTitle>Add a Device</DialogTitle>
        <DialogContent>
          <Stack gap='40px' alignItems='center'>
            <Alert severity={state == State.Connected ? 'success' : 'info'}>
              {instructions[state]}
            </Alert>
            {state == State.Connecting && <CircularProgress />}
            {error && <Alert severity='error'>{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction='row' gap='20px'>
            <Button onClick={handleClose}>Cancel</Button>
            {state == State.Connected
              && <Button
                onClick={handleClose}
                href={`http://172.16.0.1?0=${networkData.network_id}&1=${networkData.refresh_token}&2=${ssid}&3=${pass}`}
                target="_blank">
                Continue
              </Button>}
          </Stack>
        </DialogActions>
      </Stack>
    </Dialog>
  </div>;
}
