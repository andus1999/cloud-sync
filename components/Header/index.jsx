import { Stack, Button } from '@mui/material';
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

export default function Header() {
  const out = () => {
    const auth = getAuth();
    signOut(auth);
  }

  return <Stack alignItems='center' position='fixed' width='100%' zIndex={1200}>
    <Stack direction='row' justifyContent='right' width='100%' maxWidth='1100px' padding='20px'>
      <Button onClick={out}>
        Sign out
      </Button>
    </Stack>
  </Stack>;
}
