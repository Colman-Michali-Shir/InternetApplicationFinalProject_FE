import { createTheme } from '@mui/material/styles';
import { grey, purple,lime } from '@mui/material/colors';

// Define your color palette here
const theme = createTheme({
  palette: {
    primary: purple,
    secondary: lime,
    background: {
      default: grey[100], // Default background color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Consistent rounded corners
          textTransform: 'none', // Disable uppercase
        //   padding: '10px 20px',
        },
      },
      defaultProps: {
        variant: 'contained',
        color: 'primary',
      },
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    button: {
      fontWeight: 600,
    },
  },
});

export default theme;
