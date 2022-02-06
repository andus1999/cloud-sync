import React, { FormEventHandler } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button, Stack, TextField, Typography, Alert } from '@mui/material';


export default function LoginScreen() {
  const auth = getAuth();
  const pass = React.useRef<HTMLInputElement | null>(null);
  const email = React.useRef<HTMLInputElement | null>(null);
  const [error, setError] = React.useState(null);

  const login: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!email || !pass) return;
    console.log(email)
    console.log(pass)
    signInWithEmailAndPassword(auth,
      email.current!!.value, pass.current!!.value)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        setError(error.code);
      });
  }
  return <div>
    <Stack alignItems='center' margin='100px'>
      <Stack width='100%' maxWidth='400px' gap='40px' component='form' onSubmit={login}>
        <Typography variant='h2'>
          Login
        </Typography>
        <Typography variant='subtitle1'>
          Please log in to continue
        </Typography>
        <TextField label="E-Mail" inputRef={email} />
        <TextField label="Password" type='password' inputRef={pass} />
        <Button type='submit'>Login</Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Stack>
  </div>;
}
