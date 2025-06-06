import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { HttpStatusCode } from 'axios';
import { Box, CircularProgress, Container, CssBaseline } from '@mui/material';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import TopBar from './components/TopBar';
import ProfilePage from './pages/ProfilePage';
import userService, { IUser } from './services/userService';
import { useUserContext } from './Context/UserContext';
import RecommendationPage from './pages/RecommendationPage';
import PostPage from './pages/PostPage';

const App = () => {
  const { userContext, setUserContext, storeUserSession } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

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
          const {
            data: { _id, username, profileImage },
          } = response;
          setUserContext({ _id, username, profileImage });
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
      {userContext?._id && <TopBar />}
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column' }}
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
                userContext?._id ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login handleLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/"
              element={
                userContext?._id ? (
                  <HomePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                userContext?._id ? (
                  <ProfilePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/post/:id"
              element={
                userContext?._id ? (
                  <PostPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/request-recommendation"
              element={
                userContext?._id ? (
                  <RecommendationPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        )}
      </Container>
    </>
  );
};

export default App;
