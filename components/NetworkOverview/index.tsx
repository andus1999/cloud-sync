import React from 'react';
import { Fab, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NetworkList from './NetworkList';
import CreateNetworkDialog from './CreateNetworkDialog';

export default function NetworkOverview() {
  const [open, setOpen] = React.useState(false);

  const createNewNetwork = () => {
    setOpen(true);
  }

  return <div>
    <CreateNetworkDialog open={open} setOpen={setOpen} />
    <Stack gap='50px'>
      <Typography variant='h3'>
        Networks
      </Typography>
      <NetworkList />
      <Stack width='100%' alignItems='flex-end'>
        <Fab color="primary" aria-label="add" onClick={createNewNetwork}>
          <AddIcon />
        </Fab>
      </Stack>
    </Stack>
  </div>;
}
