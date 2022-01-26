import React from 'react';
import { get, getDatabase, onValue, orderByChild, query, ref } from "firebase/database";
import { getAuth } from 'firebase/auth';
import NetworkCard, { NetworkSnapshot } from './NetworkCard';
import { Grid } from '@mui/material';

export default function NetworkList() {
  const [networkSnapshots, setNetworkSnapshots] = React.useState<Array<NetworkSnapshot>>([]);

  React.useEffect(() => {
    const auth = getAuth();
    const database = getDatabase();
    const getPermissions = () => {
      const networksRef = ref(database, 'users/' + auth.currentUser?.uid + '/networks');
      onValue(networksRef, (snapshot) => {
        if (snapshot.exists()) {
          const p: Array<NetworkSnapshot> = [];
          for (const [key, v] of Object.entries(snapshot.val())) {
            const value = v as any;
            p.push({ networkId: key, permissions: value?.permissions });
          }
          setNetworkSnapshots(p);
          console.log(p);
        } else {
          console.log("No data available");
        }
      });
    }
    getPermissions();
  }, [])


  const cards = networkSnapshots.map((it) =>
    (<NetworkCard networkSnapshot={it} key={it.networkId} />))

  return <Grid container spacing={2}>
    {cards}
  </Grid>;
}
