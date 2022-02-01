import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Stepper, Step,
  StepLabel, DialogActions, Button, CircularProgress,
  Stack, Alert, Typography, LinearProgress
} from '@mui/material';
import { NetworkData } from './NetworkCard';

enum State {
  ConnectWifi,
  SelectWifiNetwork,
}

const instructions: Array<string> = [];
instructions[State.ConnectWifi] = "Please connect to the open WiFi access point of the device.";
instructions[State.SelectWifiNetwork] = "Select a WiFi network for the new device.";

export default function AddDeviceDialog({ open, setOpen, networkData }:
  {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    networkData: NetworkData,
  }) {

  const [error, setError] = React.useState("");
  const [state, setState] = React.useState(State.ConnectWifi);
  const [ssid, setSsid] = React.useState("A1-BED564");
  const [pass, setPass] = React.useState("5AUXYAQL4F");

  React.useEffect(() => {
    if (!open)
      setState(State.ConnectWifi);
    else {
      switch (state) {
        case State.ConnectWifi:
          setError("");
          break;
        case State.SelectWifiNetwork:
          break;
      }
    }
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
            <Alert severity='info'>
              {instructions[state]}
            </Alert>
            {error && <Alert severity='error'>{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction='row' gap='20px'>
            <Button onClick={handleClose}>Cancel</Button>
            {state == State.ConnectWifi
              && <Button
                onClick={handleClose}
                href={`http://172.16.0.1?0=${networkData.network_id}&1=${networkData.refresh_token}&2=${ssid}&3=${pass}`}
                target="_blank">
                Done
              </Button>}
            {state == State.SelectWifiNetwork
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
