import { Box, Divider } from '@mui/material';
import ProfileData from '../components/ProfileData';
import Post from '../components/Post';

const Profile = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4">
      <ProfileData />
      <Divider sx={{ my: 3 }} />
    </Box>
  );
};

export default Profile;
