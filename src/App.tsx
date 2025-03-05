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

const App = () => {
  const { setUserContext } = useUserContext();
  const [user, setUser] = useState<IUser | null>(null);
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
    setUser(user);
    localStorage.setItem('userId', user._id);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setIsLoading(false);
  };

  const clearUserSession = () => {
    setUserContext(null);
    setUser(null);
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
          setUserContext({
            _id: response.data._id,
            username: response.data.username,
            profileImage: response.data.profileImage,
          });
          setUser(response.data);
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
            const { response: refreshResponse } = await userService.refresh(refreshToken);
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
      {user && <TopBar logoutUser={clearUserSession} storeUserSession={storeUserSession} />}
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
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
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login handleLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" replace />} />
            <Route
              path="/profile"
              element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
            />
          </Routes>
        )}
      </Container>
    </>
  );
};

export default App;
