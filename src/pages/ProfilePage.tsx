import { Box, Divider } from '@mui/material';
import ProfileData from '../components/ProfileData';
import PostsList from '../components/Post/PostsList';

const Profile = () => {
  return (
    <Box display='flex' flexDirection='column' gap='4'>
      <ProfileData />
      <Divider sx={{ my: 3 }} />
      <PostsList shouldGetAll={false} />
    </Box>
  );
};

export default Profile;
