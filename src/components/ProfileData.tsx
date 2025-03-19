import { useState } from 'react';
import { AxiosError, HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Paper,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
} from '@mui/material';
import { Edit, CameraAlt, Done, Clear } from '@mui/icons-material';
import { green, pink } from '@mui/material/colors';
import { useUserContext } from '../Context/UserContext';
import userService from '../services/userService';

const ProfileData = () => {
  const { userContext, updateContextUsername, updateContextProfileImage } =
    useUserContext();
  const [username, setUsername] = useState(userContext?.username || '');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(userContext?.profileImage || '');
  const [dialogDisplayProfilePic, setdialogDisplayProfilePic] =
    useState<File | null>(null);
  const [openProfilePicDialog, setOpenProfilePicDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProfilePicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const userId = userContext?._id || localStorage.getItem('userId');
    if (!userId) {
      return;
    }

    setdialogDisplayProfilePic(file);
    setOpenProfilePicDialog(true);
  };

  const handleConfirmProfilePicChange = async () => {
    if (!dialogDisplayProfilePic) return;

    const userId = userContext?._id || localStorage.getItem('userId');
    if (!userId) return;

    try {
      const uploadImageResponse = (
        await userService.uploadImage(dialogDisplayProfilePic)
      ).response;
      if (uploadImageResponse.status !== HttpStatusCode.Ok) {
        toast.error('Failed to upload image');
        return;
      }
      const imageUrl = uploadImageResponse.data.url;
      const updateUserRes = await userService.updateProfileImage(
        userId,
        imageUrl
      );
      if (updateUserRes.response.status !== HttpStatusCode.Ok) {
        toast.error('Failed to update profile image');
        return;
      }

      updateContextProfileImage(imageUrl);
      setProfilePic(imageUrl);
      toast.success('Image updated successfully');
    } catch {
      toast.error('Error uploading image');
    }

    setOpenProfilePicDialog(false);
    setdialogDisplayProfilePic(null);
  };

  const handleUsernameChange = (username: string) => {
    setUsername(username);
  };

  const handleCancelProfilePicChange = () => {
    setdialogDisplayProfilePic(null);
    setOpenProfilePicDialog(false);
  };

  const handleUsernameSubmit = async () => {
    try {
      const userId = userContext?._id || localStorage.getItem('userId');
      if (!userId) {
        return;
      }
      const { response } = await userService.updateUsername(userId, username);
      if (response.status === HttpStatusCode.Ok) {
        updateContextUsername(username);
        toast.success('Username updated successfully');
      } else {
        setUsername(userContext?.username || '');
      }

      setErrorMessage(null);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (
          error.response?.data.codeName === 'DuplicateKey' &&
          error.response?.data.keyValue.username
        ) {
          setErrorMessage('Username already exists');
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  const handleCancleEdit = () => {
    setUsername(userContext?.username || '');
    setIsEditing(false);
    setErrorMessage(null);
  };

  return (
    <Box display='flex' alignItems='center' flexDirection='column'>
      <Box position='relative' display='inline-block'>
        <Avatar src={profilePic} sx={{ width: 120, height: 120, mx: 'auto' }} />
        <IconButton
          component='label'
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'background.paper',
            border: '2px solid white',
          }}
        >
          <CameraAlt fontSize='small' />
          <input
            type='file'
            hidden
            accept='image/png, image/jpeg'
            onChange={handleProfilePicChange}
          />
        </IconButton>
      </Box>

      <Box mt={2}>
        {isEditing ? (
          <Paper
            component='form'
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder='Enter new username'
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              inputProps={{ 'aria-label': 'username' }}
            />
            <IconButton
              type='button'
              aria-label='done'
              onClick={handleUsernameSubmit}
            >
              <Done sx={{ color: green[500] }} />
            </IconButton>
            <IconButton
              type='button'
              aria-label='clear'
              onClick={handleCancleEdit}
            >
              <Clear sx={{ color: pink[500] }} />
            </IconButton>
          </Paper>
        ) : (
          <Typography variant='h5' fontWeight='bold'>
            {username}
            <IconButton onClick={() => setIsEditing(true)} size='small'>
              <Edit fontSize='small' />
            </IconButton>
          </Typography>
        )}
        {errorMessage && (
          <Typography marginInlineStart={1} color='error'>
            {errorMessage}
          </Typography>
        )}
      </Box>

      <Dialog
        open={openProfilePicDialog}
        onClose={handleCancelProfilePicChange}
        sx={{ '& .MuiDialog-paper': { minWidth: 350 } }}
      >
        <DialogTitle>
          <Typography fontWeight={600} color='primary' textAlign='center'>
            New Profile Picture
          </Typography>
        </DialogTitle>
        <DialogContent>
          {dialogDisplayProfilePic && (
            <Avatar
              src={URL.createObjectURL(dialogDisplayProfilePic)}
              sx={{ width: 200, height: 200, mx: 'auto' }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelProfilePicChange} variant='outlined'>
            Cancel
          </Button>
          <Button autoFocus onClick={handleConfirmProfilePicChange}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileData;
