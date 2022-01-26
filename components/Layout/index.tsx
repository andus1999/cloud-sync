import { Stack } from '@mui/material';
import React from 'react';

export default function Layout(props: any) {
  return <>
    <Stack alignItems='center'>
      <Stack maxWidth='1200px' padding='100px 3% 50px'>
        {props.children}
      </Stack>
    </Stack>
  </>;
}
