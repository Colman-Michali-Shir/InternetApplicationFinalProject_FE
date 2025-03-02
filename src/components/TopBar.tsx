import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { alpha, styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  Box,
  Typography,
  Container,
  Divider,
  MenuItem,
  Avatar,
} from '@mui/material';
import { Menu, CloseRounded, Home, AccountCircle, Logout } from '@mui/icons-material';
import PostUploadModal from './PostUploadModal';
import { useUserContext } from '../UserContext';
import { IUser } from '../services/userService';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `16px`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow:
    'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
  padding: '8px 12px',
}));

const TopBar = ({
  logoutUser,
  storeUserSession,
}: {
  logoutUser: () => void;
  storeUserSession: (userData: { accessToken: string; refreshToken: string; user: IUser }) => void;
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPostUploadModalOpen, setIsPostUploadModalOpen] = useState(false);
  const { userContext } = useUserContext();

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);
  };

  const togglePostUploadModal = (newOpen: boolean) => () => {
    setIsPostUploadModalOpen(newOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    logoutUser();
  };
  const handleUpload = () => {
    setIsDrawerOpen(false);
    setIsPostUploadModalOpen(true);
  };
  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                onClick={handleLogout}
                color="primary"
                aria-label="Logout"
                component={RouterLink}
                to="/login"
              >
                <Logout />
              </IconButton>
              <IconButton color="primary" aria-label="Home" component={RouterLink} to="/">
                <Home />
              </IconButton>
              <Button variant="text" size="medium" onClick={togglePostUploadModal(true)}>
                Upload
              </Button>
              <PostUploadModal
                open={isPostUploadModalOpen}
                handleClose={togglePostUploadModal(false)}
                storeUserSession={storeUserSession}
                clearUserSession={logoutUser}
              ></PostUploadModal>
            </Box>
          </Box>

          <Box
            sx={{
              textAlign: { xs: 'left', md: 'center' },
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            <Typography variant="h6" fontWeight={600} color="primary">
              Foodie Finder
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <IconButton color="primary" aria-label="Profile" component={RouterLink} to="/profile">
              {userContext?.profileImage ? (
                <Avatar
                  src={userContext.profileImage}
                  alt="Profile"
                  sx={{ width: 25, height: 25 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <Menu />
            </IconButton>
            <Drawer
              anchor="top"
              open={isDrawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRounded />
                  </IconButton>
                </Box>

                <MenuItem component={RouterLink} to="/" onClick={toggleDrawer(false)}>
                  Home
                </MenuItem>
                <MenuItem onClick={handleUpload}>Upload</MenuItem>
                <MenuItem onClick={handleLogout} component={RouterLink} to="/login">
                  Logout
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    component={RouterLink}
                    to="/profile"
                  >
                    Profile
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
