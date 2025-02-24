import * as React from 'react';
// import { AppProvider } from '@toolpad/core/AppProvider';

import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { googleSignin } from '../services/userService';
// import { useTheme } from '@mui/material/styles';

const SignIn = () => {
  //   const theme = useTheme();
  const googleResponseMessage = async (
    credentialResponse: CredentialResponse,
  ) => {
    console.log('google success', credentialResponse);
    await googleSignin(credentialResponse);
  };

  const googleErrorMessage = () => {
    console.log('google error');
  };
  return (
    // <AppProvider theme={theme}>
    <GoogleLogin
      onSuccess={googleResponseMessage}
      onError={googleErrorMessage}
    />
    // </AppProvider>
  );
};

export default SignIn;
