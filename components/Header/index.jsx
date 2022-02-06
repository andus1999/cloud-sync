import { Stack, Button, Divider } from '@mui/material';
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Values from '../../styles/Values';
import Colors from '../../styles/Colors';

export default function Header() {
  const out = () => {
    const auth = getAuth();
    signOut(auth);
  }

  return <Stack
    backgroundColor={Colors.surface}
    alignItems='center'
    position='fixed'
    zIndex={1200}
    sx={{
      marginLeft: { xs: 0, sm: Values.drawerWidth },
      width: { xs: '100%', sm: `calc(100% - ${Values.drawerWidth})` },
    }}>
    <Stack
      direction='row'
      justifyContent='right'
      width='100%'
      maxWidth='1100px'
      alignItems='center'
      height='80px'
      padding='0 20px'>
      <Button onClick={out}>
        Sign out
      </Button>
    </Stack>
    <Divider sx={{ width: '100%' }} />
  </Stack>;
}
