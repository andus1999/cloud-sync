import { createTheme } from "@mui/material";
import Colors from './Colors';

const base = createTheme({
  palette: {
    primary: {
      main: Colors.primary,
    }
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'Sora',
    textAlign: 'center',
    h1: {
      fontWeight: 'bold',
    },
    h2: {
      fontWeight: 'bold',
    },
    h3: {
      fontWeight: 'bold',
    },
    h4: {
      fontWeight: 'bold',
    },
    h5: {
      fontWeight: 'bold',
    }
  },
})



const theme = createTheme(base, {
  components: {
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      }
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      }
    },
    MuiListItemIcon: {
      styleOverrides:
      {
        root: {
          color: Colors.onSurface,
        }
      }
    },
    MuiIconButton: {
      styleOverrides:
      {
        root: {
          color: Colors.onSurface,
        }
      }
    }
  }
});

export default theme;