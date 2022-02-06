import React from 'react';
import { CircularProgress, Divider, Fab, Stack, Typography } from '@mui/material';
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

      <Stack direction='row' gap='40px' alignItems='center' padding='0 3%'>
        <CloudIcon fontSize='large' />
        <Typography variant='h4'>
          Networks
        </Typography>
      </Stack>

      <NetworkList />
      <Stack width='100%' alignItems='flex-end' padding='0 3%'>
        <Fab color="primary" aria-label="add" onClick={createNewNetwork}>
          <AddIcon />
        </Fab>
      </Stack>
    </Stack>
  </div>;
}
