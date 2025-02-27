import { useState } from 'react';
import { Avatar, Box, IconButton, TextField, Typography } from '@mui/material';
import { Edit, CameraAlt } from '@mui/icons-material';

const ProfileHeader = () => {
  const [username, setUsername] = useState('JohnDoe');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <Box>
      <Box position="relative" display="inline-block">
        <Avatar src={profilePic} sx={{ width: 120, height: 120, mx: 'auto' }} />
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: 'background.paper',
            border: '2px solid white',
          }}
        >
          <CameraAlt fontSize="small" />
          <input type="file" hidden accept="image/*" onChange={handleProfilePicChange} />
        </IconButton>
      </Box>

      <Box mt={2}>
        {isEditing ? (
          <TextField
            value={username}
            onChange={handleUsernameChange}
            onBlur={() => setIsEditing(false)}
            autoFocus
          />
        ) : (
          <Typography variant="h5" fontWeight="bold">
            {username}
            <IconButton onClick={() => setIsEditing(true)} size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProfileHeader;
