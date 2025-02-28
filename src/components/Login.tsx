import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import userService, { IUser } from '../services/userService';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { AxiosError, HttpStatusCode } from 'axios';

interface FormData {
  username: string;
  password: string;
  img?: File[];
}

const Login: FC<{
  handleLoginSuccess: (responseLogin: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => void;
}> = ({ handleLoginSuccess }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const { register, handleSubmit, watch, reset } = useForm<FormData>();

  const img = watch('img');

  useEffect(() => {
    if (img?.[0]) {
      setSelectedImage(URL.createObjectURL(img[0]));
    }
  }, [img]);

  const onSubmit = async (data: FormData) => {
    setErrorMessage(null);
    try {
      let uploadImageResponse;
      if (!isLogin && data.img?.[0]) {
        uploadImageResponse = (await userService.uploadImage(data.img[0])).response;
      }

      if (isLogin) {
        const { response } = await userService.loginWithUsernameAndPassword(
          data.username,
          data.password,
        );
        if (response.status === HttpStatusCode.Ok) {
          handleLoginSuccess(response.data);
        }
      } else {
        const newUser: Omit<IUser, '_id'> = {
          username: data.username,
          password: data.password,
          ...(uploadImageResponse && { profileImage: uploadImageResponse.data.url }),
        };

        const { response: registerResponse } = await userService.register(newUser);
        if (registerResponse.status === HttpStatusCode.Ok) {
          const { response: loginResponse } = await userService.loginWithUsernameAndPassword(
            data.username,
            data.password,
          );
          if (loginResponse.status === HttpStatusCode.Ok) {
            handleLoginSuccess(loginResponse.data);
          }
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data || 'An error occurred. Please try again.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  const googleResponseMessage = async (credentialResponse: CredentialResponse) => {
    setErrorMessage(null);
    if (!credentialResponse?.credential) {
      setErrorMessage('Invalid Google response. Please try again.');
      return;
    }
    try {
      const { response } = await userService.googleLogin(credentialResponse);
      if (response.status === HttpStatusCode.Ok) {
        handleLoginSuccess(response.data);
      } else {
        setErrorMessage('Google login failed. Please try again.');
      }
    } catch {
      setErrorMessage('An error occurred during Google login.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Card elevation={6} sx={{ mt: 8, p: 4, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {isLogin ? 'Login' : 'Register'}
          </Typography>

          {!isLogin && (
            <>
              <Avatar
                src={selectedImage || ''}
                sx={{ width: 100, height: 100, margin: '0 auto' }}
              />
              <input
                {...register('img')}
                type="file"
                accept="image/png, image/jpeg"
                hidden
                id="upload-button"
              />
              <label htmlFor="upload-button">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              {...register('username')}
              label="Username"
              fullWidth
              margin="normal"
              required
              autoFocus
            />
            <TextField
              {...register('password')}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              {isLogin ? 'Login' : 'Register'}
            </Button>

            <Typography
              fontWeight="bold"
              sx={{ mt: 4, fontSize: 12, cursor: 'pointer', color: 'primary.main' }}
              onClick={() => {
                setIsLogin(!isLogin);
                reset();
                setSelectedImage(null);
                setErrorMessage(null);
              }}
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </Typography>
          </Box>

          {errorMessage && <Typography color="error">{errorMessage}</Typography>}

          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <GoogleLogin
              onSuccess={googleResponseMessage}
              onError={() => setErrorMessage('Google login failed.')}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
