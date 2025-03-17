import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  styled,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import postsService, { IPost } from '../../services/postsService';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
import SavePostModal from './SavePostModal';
import { toast } from 'react-toastify';
import { HttpStatusCode } from 'axios';
import moment from 'moment';
import { StyledTypography } from './StyledTypography';
import PostBottomBar from './PostBottomBar';
import likesService from '../../services/likesService';

const User = ({
  post,
  user,
  isOwner,
  isPostUploadModalOpen,
  onEditClick,
  onClose,
  setPostState,
}: {
  post: IPost;
  user: { _id: string; username: string; profileImage?: string };
  isOwner: boolean;
  isPostUploadModalOpen: boolean;
  onEditClick: () => void;
  onClose: () => void;
  setPostState: React.Dispatch<React.SetStateAction<IPost>>;
}) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeletePost = async () => {
    try {
      const { response } = await postsService.deletePost(post._id);
      if (response.status === HttpStatusCode.Ok) {
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '16px',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          alt={user.username}
          src={user.profileImage}
          sx={{ width: 24, height: 24 }}
        />
        <Typography variant='subtitle1'>{user.username}</Typography>
      </Box>

      {isOwner && (
        <Box sx={{ position: 'absolute', right: 8 }}>
          <IconButton size='small' onClick={onEditClick}>
            <Edit />
          </IconButton>
          <IconButton size='small' onClick={handleDeleteConfirmation}>
            <Delete color='error' />
          </IconButton>
        </Box>
      )}

      <SavePostModal
        open={isPostUploadModalOpen}
        handleClose={onClose}
        post={post}
        setPostState={setPostState}
      />

      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color='inherit'>
            Cancel
          </Button>
          <Button onClick={handleDeletePost} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const Post = ({
  post,
  shouldExtraDetails = false,
}: {
  post: IPost;
  shouldExtraDetails?: boolean;
}) => {
  const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: theme.palette.background.paper,

    '&:focus-visible': {
      outline: '3px solid',
      outlineColor: 'hsla(210, 98%, 48%, 0.5)',
      outlineOffset: '2px',
    },
  }));

  const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
      paddingBottom: 16,
    },
  });
  const navigate = useNavigate();
  const { userContext } = useUserContext();
  const [isPostUploadModalOpen, setIsPostUploadModalOpen] = useState(false);
  const [postState, setPostState] = useState<IPost>(post);
  const [likesCountState, setLikesCountState] = useState(post.likesCount);
  const [likedByCurrentUserState, setLikedByCurrentUserState] = useState(
    post.likedByCurrentUser
  );

  const { postedBy, image, title, content, commentsCount, rating, _id } =
    postState;
  const isOwner = postedBy._id === userContext?._id;

  const handleEditClick = () => {
    setIsPostUploadModalOpen(true);
  };

  const handleModalClose = () => {
    setIsPostUploadModalOpen(false);
  };

  const handleLike = async () => {
    try {
      const { response } = await likesService.addLike(_id);
      if (response.status === HttpStatusCode.Created) {
        setLikesCountState((prevCount) => prevCount + 1);
        setLikedByCurrentUserState(true);
      }
    } catch {
      toast.error('Error liking post');
    }
  };

  const handleRemoveLike = async () => {
    try {
      const { response } = await likesService.removeLike(_id);
      if (response.status === HttpStatusCode.Ok) {
        setLikesCountState((prevCount) => prevCount - 1);
        setLikedByCurrentUserState(false);
      }
    } catch {
      toast.error('Error unliking post');
    }
  };

  return (
    <StyledCard variant='outlined' tabIndex={0}>
      <User
        post={postState}
        user={postedBy}
        isOwner={isOwner && shouldExtraDetails}
        onEditClick={handleEditClick}
        onClose={handleModalClose}
        isPostUploadModalOpen={isPostUploadModalOpen}
        setPostState={setPostState}
      />
      <CardMedia
        component='img'
        image={image}
        sx={{
          aspectRatio: '16 / 9',
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'pointer',
          },
        }}
        onClick={() =>
          !shouldExtraDetails && navigate(`/post/${postState._id}`)
        }
      />
      <StyledCardContent>
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ marginLeft: 'auto' }}
        >
          {moment(postState.createdAt).fromNow()}
        </Typography>
        <Typography gutterBottom variant='h6' component='div'>
          {title}
        </Typography>
        <StyledTypography variant='body2' color='text.secondary' gutterBottom>
          {content}
        </StyledTypography>
      </StyledCardContent>
      <PostBottomBar
        likesCount={likesCountState}
        commentsCount={commentsCount}
        rating={rating}
        likedByCurrentUser={likedByCurrentUserState}
        shouldExtraDetails={shouldExtraDetails}
        handleLike={handleLike}
        handleRemoveLike={handleRemoveLike}
      />
    </StyledCard>
  );
};

export default Post;
