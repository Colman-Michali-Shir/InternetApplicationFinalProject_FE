import { GoogleOAuthProvider } from '@react-oauth/google';
import SignIn from './components/SignIn';

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId="793980665200-romrdmq68khsr477gevm9i1kvsiui24j.apps.googleusercontent.com">
        <SignIn />
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
