import React from 'react';
import { Drawer, List, ListItemIcon, ListItem, ListItemText, Stack, Divider, Typography, ListItemButton, Box } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import Values from '../../resources/Values';
import Colors from '../../styles/Colors';
import CloudIcon from '@mui/icons-material/Cloud';
import Link from 'next/link';

interface MenuItem {
  name: string,
  link: string,
  icon: JSX.Element,
}

export default function SideBar({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const handleDrawerToggle = () => {
    setOpen(!open);
  }

  const container = window !== undefined ? () => window.document.body : undefined;
  onresize = () => {
    if (innerWidth >= 600)
      setOpen(false);
  }


  const menuItems: Array<MenuItem> = [
    { name: 'Networks', link: '/networks', icon: <CloudIcon /> },
    { name: 'Settings', link: '/settings', icon: <SettingsIcon /> },
  ];

  const menuElements = menuItems.map((it) => (
    <Link href={it.link} passHref key={it.name}>
      <ListItemButton component='a' sx={{ padding: 0 }}>
        <ListItem button>
          <ListItemIcon >
            {it.icon}
          </ListItemIcon>
          <ListItemText primary={it.name} sx={{ textAlign: 'left' }} />
        </ListItem>
      </ListItemButton>
    </Link>));

  const drawer = <Stack gap='20px' padding='0 20px'>
    <Stack>
      <Stack height='80px' alignItems='center' justifyContent='center'>
        <Typography variant='h5'>
          Cloud Sync
        </Typography>
      </Stack>
      <Divider sx={{ width: '100%' }} />
    </Stack>

    <List>
      {menuElements}
    </List>
  </Stack>

  return <div>
    <Drawer
      container={container}
      variant="temporary"
      open={open}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: Values.drawerWidth },
      }}
    >
      {drawer}
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: Values.drawerWidth },
      }}
      open
    >
      {drawer}
    </Drawer>
  </div>;
}
