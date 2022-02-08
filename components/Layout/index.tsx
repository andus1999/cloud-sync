import { Stack } from '@mui/material';
import React from 'react';
import Values from '../../resources/Values';

export default function Layout(props: any) {
  return <>
    <Stack alignItems='center' sx={{ marginLeft: { xs: 0, sm: Values.drawerWidth } }}>
      <Stack padding='120px 0 50px' width='100%'>
        {props.children}
      </Stack>
    </Stack>
  </>;
}
