import { Stack, Button, Divider, Typography, colors, IconButton } from '@mui/material';
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Values from '../../resources/Values';
import Colors from '../../styles/Colors';
import CircleIcon from '@mui/icons-material/Circle';
import MenuIcon from '@mui/icons-material/Menu';
import SideBar from '../SideBar';

export default function Header() {
  const [online, setOnline] = React.useState(navigator.onLine);
  const [sideBarOpen, setSideBarOpen] = React.useState(false);

  const out = () => {
    const auth = getAuth();
    signOut(auth);
  }

  React.useEffect(() => {
    window.addEventListener('offline', () => setOnline(false));
    window.addEventListener('online', () => setOnline(true));
  }, [])


  return <>
    <SideBar open={sideBarOpen} setOpen={setSideBarOpen} />
    <Stack
      backgroundColor={Colors.surface}
      alignItems='center'
      position='fixed'
      zIndex={1200}
      sx={{
        marginLeft: { xs: 0, sm: Values.drawerWidth },
        width: { xs: '100%', sm: `calc(100% - ${Values.drawerWidth})` },
      }}>
      <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%' padding='0 20px'>
        <IconButton onClick={() => setSideBarOpen(!sideBarOpen)} sx={{
          display: { xs: 'block', sm: 'none' },
        }}>
          <MenuIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
        <Stack
          direction='row'
          justifyContent='right'
          width='100%'
          maxWidth='1100px'
          alignItems='center'
          height='80px'
          gap='30px'>
          <Stack direction='row' gap='10px' alignItems='center'>
            <div style={{ margin: '0 0 4px' }}>
              <CircleIcon sx={{ color: online ? Colors.success : Colors.error, fontSize: '0.7rem' }} />
            </div>
            <Typography variant='body2'>
              {online ? 'Online' : 'Offline'}
            </Typography>
          </Stack>
          <Button onClick={out}>
            Sign out
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ width: '100%' }} />
    </Stack>
  </>;
}
