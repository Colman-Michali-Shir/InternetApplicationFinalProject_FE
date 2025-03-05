import { createTheme } from '@mui/material/styles';
import { grey, deepPurple, lime } from '@mui/material/colors';

// Define your color palette here
const theme = createTheme({
  palette: {
    primary: deepPurple,
    secondary: lime,
    background: {
      default: grey[100], // Default background color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px', // Consistent rounded corners
          textTransform: 'none', // Disable uppercase
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
