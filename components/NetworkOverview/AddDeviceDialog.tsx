import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Stepper, Step,
  StepLabel, DialogActions, Button, CircularProgress,
  Stack, Alert, Typography, LinearProgress
} from '@mui/material';
import { NetworkData } from './NetworkCard';
import { getDatabase, onValue, ref } from 'firebase/database';

enum State {
  Connecting,
  SendingNetworkInformation,
  WiFiCredentials,
  SendingWiFiCredentials,
  Falling, // Device has been left alone and attempts to connect to the database
  Success,
}

const steps: Array<number> = []
steps[State.Connecting] = 0;
steps[State.SendingNetworkInformation] = 0;
steps[State.WiFiCredentials] = 1;
steps[State.SendingWiFiCredentials] = 1;
steps[State.Falling] = 2;
steps[State.Success] = 3;

const stepDescriptions = ["Connect to a device", "Initialize the device", "Falling", "Success!"];

const instructions: Array<string> = [];
instructions[State.Connecting] = "Please connect to the open WiFi access point of the device. Do not leave this site.";
instructions[State.SendingNetworkInformation] = "Successfully connected to the device.";
instructions[State.WiFiCredentials] = "Please enter your WiFi credentials. Make sure your WiFi network is connected to the internet.";
instructions[State.SendingWiFiCredentials] = "Sending credentials to the device.";
instructions[State.Falling] = "The device is falling. Hopefully it will end up in your network. 🙂";
instructions[State.Success] = "The device has been added successfully! 🎉";

export default function AddDeviceDialog({ open, setOpen, networkData }:
  {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    networkData: NetworkData,
  }) {

  const [error, setError] = React.useState("");
  const [state, setState] = React.useState(State.Connecting);
  const [ssid, setSsid] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [timer, setTimer] = React.useState(0);
  const [mac, setMac] = React.useState("");

  // Timer
  React.useEffect(() => {
    if (state == State.Falling && timer > 0) {
      const timeout = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [timer, state]);


  React.useEffect(() => {

    const putNetworkInformation = async () => {

      setState(State.SendingNetworkInformation);

      const res = await fetch("https://172.16.0.1/network-information", {
        method: 'PUT',
        body: networkData.network_id + ',' + networkData.refresh_token,
      });

      const text = await res.text();
      console.log(text);
      if (text == 'wifi_connected') {
        setState(State.Falling);
        console.log("WiFi connected!");
      }
      else {
        setState(State.WiFiCredentials);
        console.log("Not connected to WiFi.");
      }
    }

    const timeout = (time: number) => {
      let controller = new AbortController();
      setTimeout(() => controller.abort(), time * 1000);
      return controller;
    };

    let canceled = false;

    const ping = async () => {
      console.log("Start pinging.");

      if (!(networkData.refresh_token && networkData.network_id)) {
        setError("The network was not set up correctly.");
        return;
      }

      while (!canceled) {
        let res: Response | null = null;

        try {
          res = await fetch("https://172.16.0.1/ping", {
            signal: timeout(2).signal,
          });
        } catch {
          console.log("Fetch error");
        }

        if (res?.status == 200) {
          const text = await res.text();
          console.log(text);
          if (!canceled) {
            setMac(text);
            setError("");
            putNetworkInformation();
            break;
          }
        }

        await new Promise(r => setTimeout(r, 1000));
      }
    }

    const observeDatabase = () => {
      setTimer(20);
      setTimeout(async () => {
        let res: Response | null = null;

        try {
          res = await fetch("https://172.16.0.1/success")
        } catch {
          console.log("fetch error");
        }

        if (res?.status == 200) {
          const text = await res.text();
          if (text == "true") {
            setState(State.Success);
            return;
          }
        }

        setError("The Connection to the device was lost. Please try again. 😓")
        setState(State.WiFiCredentials);
      }, 19000);
    }

    if (!open)
      setState(State.Connecting);
    else {
      switch (state) {
        case State.Connecting:
          setError("");
          setMac("");
          ping();
          break;
        case State.SendingNetworkInformation:
          break;
        case State.WiFiCredentials:
          break;
        case State.SendingWiFiCredentials:
          break;
        case State.Falling:
          observeDatabase();
          break;
      }
    }

    return () => { canceled = true; }

  }, [state, networkData.network_id, networkData.refresh_token, open, mac]);

  const sendCredentials = async () => {

    setError("");
    setState(State.SendingWiFiCredentials);

    const res = await fetch('https://172.16.0.1/credentials', {
      method: 'PUT',
      body: ssid + ',' + pass
    });

    if ((await res.text()) == 'true') {
      setState(State.Falling);
    } else {
      setError("Could not connect. Please try again.");
      setState(State.WiFiCredentials);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    if (state == State.WiFiCredentials)
      sendCredentials();
    else setState(state + 1);
  };

  const handleBack = () => {
    setState(state - 1);
  }

  return <div>
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
      <Stack gap='40px' padding='5%'>
        <DialogTitle>Add a Device</DialogTitle>
        <DialogContent>
          <Stack gap='40px'>
            <Stepper activeStep={steps[state]} alternativeLabel>
              {stepDescriptions.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Alert severity={state == State.Success ? 'success' : 'info'}>
              {instructions[state]}
            </Alert>
            {state == State.Falling && <Typography variant='h5'>{timer}</Typography>}
            {state == State.Falling &&
              <LinearProgress variant='determinate' value={(1 - timer / 20) * 100} />}
            {(state == State.SendingWiFiCredentials || state == State.SendingNetworkInformation)
              && <Stack alignItems='center'>
                <CircularProgress />
              </Stack>}
            {state == State.WiFiCredentials && <TextField
              defaultValue={ssid}
              label="WiFi Network"
              onChange={(e) => setSsid(e.target.value)}
            />}
            {state == State.WiFiCredentials && <TextField
              defaultValue={pass}
              label="Password"
              type='password'
              onChange={(e) => setPass(e.target.value)}
            />}
            {error && <Alert severity='error'>{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {state == State.WiFiCredentials && <Button onClick={handleBack}>Back</Button>}
          {state == State.WiFiCredentials && ssid && pass && <Button onClick={handleNext}>Connect</Button>}
          {state == State.Success && <Button onClick={handleClose}>Close</Button>}
        </DialogActions>
      </Stack>
    </Dialog>
  </div>;
}
