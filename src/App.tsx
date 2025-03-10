import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { HttpStatusCode } from 'axios';
import { Box, CircularProgress, Container, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import TopBar from './components/TopBar';
import ProfilePage from './pages/ProfilePage';
import userService, { IUser } from './services/userService';
import { useUserContext } from './UserContext';
import Post from './components/Post/Post';

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

      if (!storedUserId) {
        setUserContext(null);
        setIsLoading(false);

        return;
      }

      try {
        const { response } = await userService.getUserById(storedUserId);

        if (response.status === HttpStatusCode.Ok) {
          setUserContext({
            _id: response.data._id,
            username: response.data.username,
            profileImage: response.data.profileImage,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {userContext && <TopBar logoutUser={clearUserSession} />}
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
                userContext ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login handleLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/"
              element={
                userContext ? <HomePage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/profile"
              element={
                userContext ? <ProfilePage /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/post/:id" element={<Post />} />
          </Routes>
        )}
      </Container>
    </>
  );
};

export default App;
