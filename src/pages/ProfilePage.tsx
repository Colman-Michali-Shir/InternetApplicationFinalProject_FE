import { Box, Divider } from '@mui/material';
import ProfileData from '../components/ProfileData';
import PostsList from '../components/Post/PostsList';

const Profile = ({
  shouldReFetch,
  setShouldReFetch,
}: {
  shouldReFetch: boolean;
  setShouldReFetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Box display='flex' flexDirection='column' gap='4'>
      <ProfileData />
      <Divider sx={{ my: 3 }} />
      <PostsList
        shouldGetAll={false}
        shouldReFetch={shouldReFetch}
        setShouldReFetch={setShouldReFetch}
      />
    </Box>
  );
};

export default Profile;
