import { Stack, Button } from '@mui/material';
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

export default function Header() {
  const out = () => {
    const auth = getAuth();
    signOut(auth);
  }

  return <Stack>
    <Button onClick={out}>
      Sign out
    </Button>
  </Stack>;
}
