import React from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  TextField, Stepper, Step,
  StepLabel, DialogActions, Button, CircularProgress, Stack, Alert, Typography
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
  const [stepInternal, setStepInternal] = React.useState("ping");
  const [ssid, setSsid] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [timer, setTimer] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(timeout);
  }, [timer]);

  React.useEffect(() => {

    let timeout: any;

    const putNetworkInformation = async () => {
      const res = await fetch("http://172.16.0.1/network-information", {
        method: 'PUT',
        body: networkData.network_id + ',' + networkData.refresh_token,
      });
      console.log(res.status);
      const text = await res.text();
      console.log(text);
      if (text == 'true') {
        setStepInternal("test_wifi");
        setTimer(20);
        timeout = setTimeout(() => {
          setStep(1);
          setStepInternal("credentials");
        }, 20000);
        console.log("Testing Wifi connection");
      }
      else {
        setStep(1);
        setStepInternal("credentials");
        console.log("Not connected to Wifi");
      }
    }

    let canceled = false;

    const poll = async () => {
      console.log("starting polling");
      while (!canceled) {
        let res: Response;
        try {
          res = await fetch("http://172.16.0.1/success");
        } catch {
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        if (res.status == 200) {
          const text = await res.text();
          console.log(text);
          if (text == 'true' && !canceled) {
            console.log("success poll");
            if (stepInternal == "test_wifi" || stepInternal == "test_credentials") {
              clearTimeout(timeout);
            }
            setError("");
            setStep(2);
            setStepInternal("success");
            break;
          }
          else if (stepInternal == "ping") {
            console.log("connection test");
            setStepInternal("ping_done");
            putNetworkInformation();
            break;
          }
        }
      }
    }

    if (stepInternal == "test_credentials") {
      timeout = setTimeout(() => {
        setStepInternal("credentials");
        setError("Could not connect to the server. Please try again.");
      }, 20000);
    }

    if (stepInternal == "ping") {
      setError("");
    }

    if (stepInternal != "success" && networkData.refresh_token && networkData.network_id && open) {
      poll();
    }
    return () => { canceled = true; }
  }, [stepInternal, networkData.network_id, networkData.refresh_token, open]);

  const sendCredentials = async () => {
    setError("");
    setStepInternal("send_credentials");
    const res = await fetch('http://172.16.0.1/credentials', {
      method: 'PUT',
      body: ssid + ',' + pass
    });

    if ((await res.text()) == 'true') {
      setStep(2);
    }
    else {
      setTimer(20);
      setStepInternal("test_credentials");
    }
  }

  const handleClose = () => {
    setOpen(false);
    setStep(0);
    setStepInternal("ping");
  };

  const handleNext = () => {
    if (step == 1)
      sendCredentials();
    else setStep(step + 1);
  };

  const handleBack = () => {
    if (step == 1) {
      setStepInternal("ping");
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
            {(stepInternal == "test_wifi" || stepInternal == "test_credentials") && <Typography>
              {timer}</Typography>}
            {(stepInternal == "ping_done" || stepInternal == "send_credentials") && <Stack alignItems='center'>
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
          {step == 1 && <Button onClick={handleBack}>Back</Button>}
          {step == 1 && ssid && pass && <Button onClick={handleNext}>Connect</Button>}
          {step == 2 && <Button onClick={handleClose}>Close</Button>}
        </DialogActions>
      </Stack>
    </Dialog>
  </div>;
}
