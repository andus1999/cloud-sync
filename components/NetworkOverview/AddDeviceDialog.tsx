import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Stepper, Step,
  StepLabel, DialogActions, Button, CircularProgress, Stack, Alert
} from '@mui/material';
import { NetworkData } from './NetworkCard';

export default function AddDeviceDialog({ open, setOpen, networkData }:
  {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    networkData: NetworkData,
  }) {
  const [error, setError] = React.useState("");
  const [step, setStep] = React.useState(0);
  const [connectionSuccess, setConnectionSuccess] = React.useState(false);
  const [ssid, setSsid] = React.useState("");
  const [pass, setPass] = React.useState("");

  React.useEffect(() => {

    const putNetworkInformation = async () => {
      const res = await fetch("http://172.16.0.1/network-information", {
        method: 'PUT',
        body: networkData.network_id + ',' + networkData.refresh_token,
      });
      console.log(res.status);
      const text = await res.text();
      console.log(text);
      if (text == '1') {
        setStep(2);
        console.log("connected");
      }
      else {
        setStep(1);
        console.log("notConnected");
      }
    }

    let canceled = false;
    const connectToDevice = async () => {
      console.log('Connection testing while loop.');
      while (!canceled) {
        let res: Response;
        try {
          res = await fetch("http://172.16.0.1/connection");
        } catch {
          continue;
        }
        if (res.status == 200) {
          const text = await res.text();
          console.log(text);
          if (text == 'ok' && !canceled) {
            setConnectionSuccess(true);
            putNetworkInformation();
            break;
          }
        }
      }
      console.log('Connection testing canceled.');
    };
    if (step == 0 && networkData.refresh_token && networkData.network_id && open) {
      setConnectionSuccess(false);
      connectToDevice();
    }
    return () => { canceled = true; }
  }, [step, networkData.network_id, networkData.refresh_token, open]);

  const sendCredentials = async () => {
    setError("");
    const res = await fetch('http://172.16.0.1/credentials', {
      method: 'PUT',
      body: ssid + ',' + pass
    });

    if ((await res.text()) == '1') {
      setStep(2);
    }

    else {
      setError("Could not connect to the WiFi netowork. Please try again.");
    }
  }

  const handleClose = () => {
    setOpen(false);
    setStep(0);
  };

  const handleNext = () => {
    if (step == 1)
      sendCredentials();
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step == 1) {
      setPass("");
      setSsid("");
    }
    setStep(step - 1);
  }

  const steps = ["Connect to a device", "Initialize the device", "Success!"];
  const instructions = ["Please connect to the open WiFi access point of the device. Do not leave this site.",
    "Please enter your WiFi credentials. Make sure your WiFi network is connected to the internet.",
    "The device has been added successfully!"];

  return <div>
    <Dialog open={open} onClose={handleClose}>
      <Stack gap='40px' padding='5%'>
        <DialogTitle>Add a Device</DialogTitle>
        <DialogContent>
          <Stack gap='40px'>
            <Stepper activeStep={step} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Alert severity={step == 2 ? 'success' : 'info'}>
              {instructions[step]}
            </Alert>
            {step == 0 && connectionSuccess && <Stack alignItems='center'>
              <CircularProgress />
            </Stack>}
            {step == 1 && <TextField
              label="WiFi Network"
              onChange={(e) => setSsid(e.target.value)}
            />}
            {step == 1 && <TextField
              label="Password"
              type='password'
              onChange={(e) => setPass(e.target.value)}
            />}
            {error && <Alert severity='error'>{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {step != 0 && step != 2 && <Button onClick={handleBack}>Back</Button>}
          {step == 1 && ssid && pass && <Button onClick={handleNext}>Next</Button>}
        </DialogActions>
      </Stack>
    </Dialog>
  </div>;
}
