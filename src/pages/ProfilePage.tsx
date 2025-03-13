import { Box, Divider } from '@mui/material';
import ProfileData from '../components/ProfileData';

import { useUserContext } from '../UserContext';

import PostsList from '../components/Post/PostsList';

const Profile = () => {
  const { userContext } = useUserContext();

  return (
    <Box display="flex" flexDirection="column" gap="4">
      <ProfileData />
      <Divider sx={{ my: 3 }} />
      <PostsList userId={userContext?._id} />
    </Box>
  );
};

export default Profile;
