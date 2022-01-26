import React from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Theme from '../styles/Theme'
import { ThemeProvider } from '@mui/material'
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import LoginScreen from './LoginScreen'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import { getDatabase, ref, set, update } from "firebase/database";
import Header from '../components/Header'
import Footer from '../components/Footer'

const firebaseConfig = {
  apiKey: "AIzaSyAhyAj4xZoz36pX5Fm4g-a8PnazteInyRQ",
  authDomain: "cloud-sync-iot.firebaseapp.com",
  databaseURL: "https://cloud-sync-iot-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cloud-sync-iot",
  storageBucket: "cloud-sync-iot.appspot.com",
  messagingSenderId: "956148285706",
  appId: "1:956148285706:web:d3bd87af649bd1b723faf3",
  measurementId: "G-QEQG8G8L2R"
};

initializeApp(firebaseConfig);

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = React.useState<undefined | null | User>(undefined);

  React.useEffect(() => {
    const auth = getAuth();
    const database = getDatabase();
    onAuthStateChanged(auth, (u) => {
      if (u) {
        const uid = u.uid;
        if (!user) update(ref(database, 'users/' + uid), {
          email: u.email,
        });
        setUser(u);
      } else {
        setUser(null);
      }
    });
  }, [user])


  return (
    <ThemeProvider theme={Theme}>
      {user && <Header />}
      <Layout>
        {user && <Component {...pageProps} />}
        {user === null && <LoginScreen />}
        {user === undefined && <Loading />}
      </Layout>
      <Footer />
    </ThemeProvider>
  )
}

export default MyApp
