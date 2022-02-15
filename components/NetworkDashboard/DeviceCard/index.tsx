import React from 'react';
import { Grid, Card, Stack, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, useButton } from '@mui/material'
import { deviceNames } from '../../../resources/Strings';
import LightSwitch from './LightSwitch';
import { Device } from '../../../types/interfaces';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import EditIcon from '@mui/icons-material/Edit';
import deviceIcons from '../deviceIcons';
import CircleIcon from '@mui/icons-material/Circle';
import Colors from '../../../styles/Colors';
import Values from '../../../resources/Values';

export default function DeviceCard({ device }: { device: Device }) {
  const [name, setName] = React.useState("")
  const [open, setOpen] = React.useState(false);

  const rename = () => {
    const db = getDatabase();
    const nameRef = ref(db, `networks/${device.info.networkId}/devices/${device.info.mac}/info/name`)
    set(nameRef, name);
    setOpen(false);
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    name && rename();
  }


  const deviceName = device.info.name || deviceNames[device.info.hardware_id];

  return <>
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Stack gap='20px' padding='20px' component='form' onSubmit={submit}>
        <DialogTitle>
          Rename the Device
        </DialogTitle>

        <DialogContent>
          <Stack gap='10px'>
            <Typography variant='body1'>
              {'The current name is ' + deviceName}
            </Typography>
            <TextField
              label='Device Name'
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {name && <Button onClick={rename} type='submit'>
            Rename
          </Button>}
        </DialogActions>
      </Stack>
    </Dialog>

    <Grid item md={6} xs={12}>
      <Card sx={{ padding: '20px', height: '100%' }}>
        <Stack padding='20px' gap='10px'>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Stack direction='row' alignItems='center' gap='20px'>
              {deviceIcons[device.info.hardware_id]}
              <Typography variant='h6' textAlign='left'>
                {deviceName}
              </Typography>
              <CircleIcon sx={{
                color: (Date.now() / 1000 - device?.localState?.heartbeat) < Values.heartbeatInterval ? Colors.success : Colors.error,
                fontSize: '0.7rem',
              }}
              />
            </Stack>

            <IconButton onClick={() => setOpen(true)}>
              <EditIcon />
            </IconButton>
          </Stack>

          <Divider />
          {(device.info.hardware_id == 'led_with_button' || device.info.hardware_id == 'esp8266_light_switch_module')
            && <LightSwitch device={device} />}
        </Stack>
      </Card>
    </Grid>
  </>;
}
