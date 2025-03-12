import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AxiosError, HttpStatusCode } from 'axios';
import { Box, CircularProgress, Container, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import TopBar from './components/TopBar';
import ProfilePage from './pages/ProfilePage';
import userService, { IUser } from './services/userService';
import { useUserContext } from './UserContext';
import RecommendationPage from './pages/RecommendationPage';

const App = () => {
  const { userContext, setUserContext } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const storeUserSession = (userData: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => {
    const { user, accessToken, refreshToken } = userData;
    setUserContext({
      username: user.username,
      _id: user._id,
      profileImage: user.profileImage,
    });
    localStorage.setItem('userId', user._id);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsLoading(false);
  };

  const clearUserSession = () => {
    setUserContext(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
    setIsLoading(false);
  };

  const handleLoginSuccess = (userData: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => {
    storeUserSession(userData);
    navigate('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = localStorage.getItem('userId');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!storedUserId || !accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { response } = await userService.getUserById(storedUserId, accessToken);

        if (response.status === HttpStatusCode.Ok) {
          const {
            data: { _id, username, profileImage },
          } = response;
          setUserContext({ _id, username, profileImage });
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        if (
          error instanceof AxiosError &&
          error.response?.status === HttpStatusCode.Unauthorized &&
          refreshToken
        ) {
          try {
            const { response: refreshResponse } = await userService.refresh();
            if (refreshResponse.status === HttpStatusCode.Ok) {
              storeUserSession(refreshResponse.data);
            } else {
              clearUserSession();
            }
          } catch {
            clearUserSession();
          }
        } else {
          clearUserSession();
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {userContext?._id && (
        <TopBar logoutUser={clearUserSession} storeUserSession={storeUserSession} />
      )}
      <CssBaseline enableColorScheme />
      <Container maxWidth="lg" component="main" sx={{ display: 'flex', flexDirection: 'column' }}>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={
                userContext?._id ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login handleLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/"
              element={userContext?._id ? <HomePage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={userContext?._id ? <ProfilePage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/recommendation"
              element={userContext?._id ? <RecommendationPage /> : <Navigate to="/login" replace />}
            />
          </Routes>
        )}
      </Container>
    </>
  );
};

export default App;
