import {
  Card,
  CardContent,
  styled,
  Typography,
  CardMedia,
  Box,
  Avatar,
  Rating,
  IconButton,
} from '@mui/material';
import { pink } from '@mui/material/colors';
import { Delete, Edit, Favorite, ModeComment, Route } from '@mui/icons-material';
import { IPost } from '../services/postsService';
import PostExtraDetails from './PostExtraDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import { IUser } from '../services/userService';

const User = ({
  user,
  isOwner,
}: {
  user: { _id: string; username: string; profileImage?: string };
  isOwner: boolean;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Push buttons to the right
        padding: '16px',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar alt={user.username} src={user?.profileImage} sx={{ width: 24, height: 24 }} />
        <Typography variant="subtitle1">{user.username}</Typography>
      </Box>

      {isOwner && (
        <Box sx={{ position: 'absolute', right: 8 }}>
          <IconButton size="small">
            <Edit />
          </IconButton>
          <IconButton size="small">
            <Delete color="error" />
          </IconButton>
        </Box>
      )}
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
        <Rating name="read-only-rating" value={rating} readOnly />
      </Box>
    </Box>
  );
};

const Post = ({ post }: { post?: IPost }) => {
  const { userContext } = useUserContext();

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
  const { state } = useLocation();
  const navigate = useNavigate();

  const postState = state?.post || post;
  const shouldExtraDetailsState = state?.shouldExtraDetails ?? false;
  const { postedBy, image, title, content, likesCount, commentsCount, rating } = postState || {};
  const isOwner = postedBy._id === userContext?._id;

  const handleEdit = () => navigate(`/edit-post/${postState._id}`, { state: { post: postState } });
  const handleDelete = () => console.log(`Delete post ${postState._id}`);
  return (
    postState && (
      <SyledCard
        variant="outlined"
        tabIndex={0}
        onClick={() =>
          !shouldExtraDetailsState &&
          navigate(`/post/${postState._id}`, {
            state: { post: postState, shouldExtraDetails: true },
          })
        }
      >
        <User user={postedBy} isOwner={isOwner && shouldExtraDetailsState} />
        <CardMedia
          component="img"
          image={image}
          sx={{
            aspectRatio: '16 / 9',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        />
        <SyledCardContent>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <StyledTypography variant="body2" color="text.secondary" gutterBottom>
            {content}
          </StyledTypography>
        </SyledCardContent>
        <BottomBar likesCount={likesCount} commentsCount={commentsCount} rating={rating} />
        {shouldExtraDetailsState && <PostExtraDetails post={postState} />}
      </SyledCard>
    )
  );
};

export default Post;
