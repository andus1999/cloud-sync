import { Stack, Typography } from '@mui/material';
import React from 'react';
import Colors from '../../styles/Colors';

export default function Footer() {
  return <div>
    <Stack
      gap='20px'
      color='white'
      padding='10%'
      height='200px'
      direction='row'
      alignItems='center'
      sx={{ background: Colors.primary, boxShadow: `0 50vh 0 50vh ${Colors.primary}` }}
    >
      <Typography variant='h5'>
        Cloud Sync
      </Typography>
    </Stack>
  </div>;
}
