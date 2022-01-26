import { createTheme } from "@mui/material";

const theme = createTheme({
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
  },
  components: {
    MuiTypography: {
      defaultProps: {
        textAlign: 'center',
      }
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides:
      {
        root: {
          transition: '0.1s',
          ":hover": {
            border: '1px solid #1976d2',
            color: '#1976d2',
          }
        }
      }
    },
  }
});

export default theme;