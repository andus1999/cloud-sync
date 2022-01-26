import { Stack } from '@mui/material';
import React from 'react';

export default function Layout(props: any) {
  return <>
    <Stack>
      <Stack maxWidth='1200px' margin='5%'>
        {props.children}
      </Stack>
    </Stack>
  </>;
}
