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
      },
      styleOverrides:
      {
        root: {
          transition: '0.5s',
          ":hover": {
            border: `1px solid ${Colors.primary}`,
            color: Colors.primary,
          }
        }
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
          color: Colors.colorOnSurface,
        }
      }
    },
    MuiIconButton: {
      styleOverrides:
      {
        root: {
          color: Colors.colorOnSurface,
        }
      }
    }
  }
});

export default theme;