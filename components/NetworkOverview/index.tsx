import React from 'react';
import { Divider, Fab, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NetworkList from './NetworkList';
import CreateNetworkDialog from './CreateNetworkDialog';
import CloudIcon from '@mui/icons-material/Cloud';

export default function NetworkOverview() {
  const [open, setOpen] = React.useState(false);

  const createNewNetwork = () => {
    setOpen(true);
  }

  return <div>
    <CreateNetworkDialog open={open} setOpen={setOpen} />
    <Stack gap='50px' alignItems='center'>
      <Stack direction='row' gap='20px' alignItems='center'>
        <CloudIcon fontSize='large' />
        <Typography variant='h3'>
          Networks
        </Typography>
      </Stack>

      <Divider sx={{ width: '50%' }} />
      <NetworkList />
      <Stack width='100%' alignItems='flex-end'>
        <Fab color="primary" aria-label="add" onClick={createNewNetwork}>
          <AddIcon />
        </Fab>
      </Stack>
    </Stack>
  </div>;
}
