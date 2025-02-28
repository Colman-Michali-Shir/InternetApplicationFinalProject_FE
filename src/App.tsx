import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Login from './components/Login';
import HomePage from './components/HomePage';
import TopBar from './components/TopBar';
import ProfilePage from './components/ProfilePage';
import userService, { IUser } from './services/userService';
import { AxiosError, HttpStatusCode } from 'axios';

const App = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  const storeUserSession = (userData: {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }) => {
    const { user, accessToken, refreshToken } = userData;
    setUser(user);
    localStorage.setItem('userId', user._id);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const clearUserSession = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login', { replace: true });
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

      if (!storedUserId || !accessToken) return;

      try {
        const { response } = await userService.getUserById(
          storedUserId,
          accessToken,
        );

        if (response.status === HttpStatusCode.Ok) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        if (
          error instanceof AxiosError &&
          error.response?.status === HttpStatusCode.Unauthorized &&
          refreshToken
        ) {
          try {
            const { response: refreshResponse } =
              await userService.refresh(refreshToken);
            if (refreshResponse.status === HttpStatusCode.Ok) {
              storeUserSession(refreshResponse.data);
            } else {
              clearUserSession();
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
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
      {user && <TopBar user={user} logoutUser={clearUserSession} />}
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
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
          <Route
            path="/"
            element={
              user ? <HomePage user={user} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Container>
    </>
  );
};

export default App;
