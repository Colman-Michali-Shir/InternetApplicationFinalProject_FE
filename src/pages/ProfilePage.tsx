import { Box, Divider, Grid2 as Grid, Card, CardMedia } from '@mui/material';
import ProfileHeader from '../components/ProfileHeader';
import Post from '../components/Post';

const Profile = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <ProfileHeader />
      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2} columns={1}>
        {[...Array(3)].map((_, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <Post index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
