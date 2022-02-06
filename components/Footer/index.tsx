import { Divider, Stack, Typography } from '@mui/material';
import React from 'react';
import Colors from '../../styles/Colors';
import Values from '../../styles/Values';

export default function Footer() {
  return <>
    <Divider />
    <Stack
      gap='20px'
      padding='0 10%'
      height='200px'
      direction='row'
      alignItems='center'
      sx={{
        marginLeft: { xs: 0, sm: Values.drawerWidth },
      }}
    >
      <Typography variant='h5'>
        Cloud Sync
      </Typography>
    </Stack>
  </>;
}
