import { Card, CardContent, styled, Typography, CardMedia, Box, Avatar } from '@mui/material';
import { pink, yellow } from '@mui/material/colors';
import { Favorite, ModeComment, Star } from '@mui/icons-material';
import { IPost } from '../services/postsService';

const Post = ({ post }: { post: IPost }) => {
  const SyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    '&:focus-visible': {
      outline: '3px solid',
      outlineColor: 'hsla(210, 98%, 48%, 0.5)',
      outlineOffset: '2px',
    },
  }));

  const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
      paddingBottom: 16,
    },
  });

  const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  const User = ({ user }: { user: { username: string; profileImage: string } }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'left',
          padding: '16px',
        }}
      >
        <Avatar alt={user.username} src={user.profileImage} sx={{ width: 24, height: 24 }} />
        <Typography variant="subtitle1">{user.username}</Typography>
      </Box>
    );
  };

  const BottomBar = ({
    likesCount,
    commentsCount,
    rating,
  }: {
    likesCount: number;
    commentsCount: number;
    rating: number;
  }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.7, alignItems: 'center' }}>
            <Favorite sx={{ color: pink[500] }} />
            <Typography variant="subtitle1">{likesCount}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.7, alignItems: 'center' }}>
            <ModeComment />
            <Typography variant="subtitle1">{commentsCount}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.7, alignItems: 'center' }}>
          <Star sx={{ color: yellow[700] }} />
          <Typography variant="subtitle1">{rating}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <SyledCard
      variant="outlined"
      tabIndex={0}
      onClick={() => console.log('Card clicked', post._id)}
    >
      <User user={post.user} />
      <CardMedia
        component="img"
        image={post.image}
        sx={{
          aspectRatio: '16 / 9',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />
      <SyledCardContent>
        <Typography gutterBottom variant="h6" component="div">
          {post.title}
        </Typography>
        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
          {post.content}
        </StyledTypography>
      </SyledCardContent>
      <BottomBar
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        rating={post.rating}
      />
    </SyledCard>
  );
};

export default Post;
