import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import CreateNetworkDialog from '../NetworkOverview/CreateNetworkDialog';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsList from './SettingsList';

export default function SettingsOverview() {

  return <>
    <Stack gap='50px' alignItems='center'>
      <Stack direction='row' gap='40px' alignItems='center' padding='0 3%'>
        <SettingsIcon fontSize='large' />
        <Typography variant='h4'>
          Settings
        </Typography>
      </Stack>

      <SettingsList />
    </Stack>
  </>;
}
