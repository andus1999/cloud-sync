import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Switch, Stack, Typography, Divider } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import { getDatabase, ref, set } from 'firebase/database';
import { deviceNames } from '../../../resources/Strings';
import { Device } from '../../../types/interfaces';

export default function LightSwitch({ device }: { device: Device }) {

  const db = getDatabase();

  const handleToggle = (key: string) => {
    const currentValue = device.cloudState?.[key];
    const valueRef = ref(db, `networks/${device.info.networkId}/devices/${device.info.mac}/cloud_state/${key}`);
    set(valueRef, currentValue != 1 ? 1 : 0);
  }

  return <List>
    <ListItem>
      <ListItemIcon>
        {device.localState?.pin_0 == 1 ? <LightbulbIcon /> : <LightbulbOutlinedIcon />}
      </ListItemIcon>
      <ListItemText primary="Led" secondary={device.localState?.pin_0 == 1 ? 'On' : 'Off'} />
      <Switch
        edge="end"
        onChange={() => handleToggle('pin_0')}
        checked={device.cloudState?.pin_0 == 1}
        inputProps={{
          'aria-labelledby': 'switch-list-label-bluetooth',
        }}
      />
    </ListItem>
  </List>;
}
