import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Stepper, Step,
  StepLabel, DialogActions, Button, CircularProgress,
  Stack, Alert, Typography, LinearProgress, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { NetworkInfo } from './NetworkCard';
import AddWiFiNetworkDialog from '../SettingsOverview/AddWiFiNetworkDialog';
import { getDatabase, off, onValue, ref } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { serialize } from 'v8';

enum State {
  ConnectWifi,
  SelectWifiNetwork,
}

const instructions: Array<string> = [];
instructions[State.ConnectWifi] = "Please connect to the open WiFi access point of the device.";
instructions[State.SelectWifiNetwork] = "Select a WiFi network for the new device.";

export default function AddDeviceDialog({ open, setOpen, networkInfo }:
  {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    networkInfo: NetworkInfo,
  }) {

  const [error, setError] = React.useState("");
  const [state, setState] = React.useState(State.ConnectWifi);
  const [ssid, setSsid] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [wifiNetworks, setWifiNetworks] = React.useState<JSX.Element[]>([]);
  const [wifiData, setWifiData] = React.useState<any | null>(null);
  const [selectedNetwork, setSelectedNetwork] = React.useState("");

  const resetState = () => {
    setError("");
    setState(State.ConnectWifi);
  }

  React.useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const networkRef = ref(db, `users/${auth.currentUser?.uid}/wifi_networks`);
    const unsub = onValue(networkRef, (snapshot) => {
      const val = snapshot.val();
      if (!val) {
        setWifiData(null);
        setWifiNetworks([]);
        return;
      }
      const wifiNames = Object.keys(val).map((it) => <MenuItem key={it} value={it}>
        {it}
      </MenuItem>);
      setWifiNetworks(wifiNames);
      setWifiData(val);
    })
    return () => unsub();
  }, [])

  React.useEffect(() => {
    if (!open)
      resetState();
    else {
      switch (state) {
        case State.ConnectWifi:
          break;
        case State.SelectWifiNetwork:
          break;
      }
    }
  }, [state, networkInfo.networkId, networkInfo.refresh_token, open]);

  const onSelect = (name: any) => {
    setSelectedNetwork(name);
    setSsid(wifiData[name]?.ssid);
    setPass(wifiData[name]?.pass);
  }

  const handleClose = () => {
    setOpen(false);
  };

  return <div>
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <Stack gap='40px' padding='5%'>
        <DialogTitle>Add a Device</DialogTitle>
        <Stepper activeStep={state} alternativeLabel>
          <Step key='connect'>
            <StepLabel>Connect to the new device</StepLabel>
          </Step>
          <Step key='wifi'>
            <StepLabel>Select a WiFi Network</StepLabel>
          </Step>
        </Stepper>
        <DialogContent>
          <Stack gap='40px' alignItems='center'>
            <Alert severity='info'>
              {instructions[state]}
            </Alert>
            {error && <Alert severity='error'>{error}</Alert>}
            {state == State.SelectWifiNetwork
              && <FormControl fullWidth>
                <InputLabel id="select-label">Network</InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                  value={selectedNetwork}
                  label="Network"
                  onChange={(e) => onSelect(e.target.value)}
                >
                  {wifiNetworks}
                </Select>
              </FormControl>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction='row' gap='20px'>
            <Button onClick={handleClose}>Cancel</Button>
            {state == State.ConnectWifi
              && <Button
                onClick={() => setState(State.SelectWifiNetwork)}>
                Continue
              </Button>}
            {state == State.SelectWifiNetwork && ssid && pass
              && <Button
                onClick={handleClose}
                href={`http://172.16.0.1?0=${networkInfo.networkId}&1=${networkInfo.refresh_token}&2=${ssid}&3=${pass}`}
                target="_blank">
                Add Device
              </Button>}
          </Stack>
        </DialogActions>
      </Stack>
    </Dialog>
  </div>;
}
