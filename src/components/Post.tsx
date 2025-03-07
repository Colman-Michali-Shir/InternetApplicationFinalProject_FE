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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import { pink } from '@mui/material/colors';
import { Delete, Edit, Favorite, ModeComment } from '@mui/icons-material';
import postsService, { IPost } from '../services/postsService';
import PostExtraDetails from './PostExtraDetails';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import { useState } from 'react';
import PostUploadModal from './PostUploadModal';
import { toast } from 'react-toastify';
import { HttpStatusCode } from 'axios';

const User = ({
  post,
  user,
  isOwner,
  handleClickEdit,
  handleClose,
  isPostUploadModalOpen,
}: {
  post: IPost;
  user: { _id: string; username: string; profileImage?: string };
  isOwner: boolean;
  handleClickEdit: () => void;
  handleClose: () => void;
  isPostUploadModalOpen: boolean;
}) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleClickDelete = async () => {
    try {
      const { response } = await postsService.deletePost(post._id);
      if (response.status === HttpStatusCode.Ok) {
        toast.success('Deleted the post successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete the post');
    }
  };

  const handleDeleteConfirmation = () => {
    setOpenDeleteDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
          <IconButton size="small" onClick={handleClickEdit}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={handleDeleteConfirmation}>
            <Delete color="error" />
          </IconButton>
        </Box>
      )}

      <PostUploadModal open={isPostUploadModalOpen} handleClose={handleClose} post={post} />

      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleClickDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
  const [isPostUploadModalOpen, setIsPostUploadModalOpen] = useState(false);

  const postState = state?.post || post;
  const shouldExtraDetailsState = state?.shouldExtraDetails ?? false;
  const { postedBy, image, title, content, likesCount, commentsCount, rating } = postState || {};
  const isOwner = postedBy._id === userContext?._id;

  return (
    <>
      {postState && (
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
          <User
            post={postState}
            user={postedBy}
            isOwner={isOwner && shouldExtraDetailsState}
            handleClickEdit={() => setIsPostUploadModalOpen(true)}
            handleClose={() => setIsPostUploadModalOpen(false)}
            isPostUploadModalOpen={isPostUploadModalOpen}
          />
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
      )}
    </>
  );
};

export default Post;
