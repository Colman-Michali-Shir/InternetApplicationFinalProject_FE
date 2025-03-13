import {
  Card,
  CardContent,
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
  styled,
} from '@mui/material';
import { pink } from '@mui/material/colors';
import { Delete, Edit, Favorite, ModeComment } from '@mui/icons-material';
import postsService, { IPost } from '../../services/postsService';
import PostExtraDetails from '../Comment/CommentsList';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../UserContext';
import { useCallback, useState } from 'react';
import SavePostModal from './SavePostModal';
import { toast } from 'react-toastify';
import { HttpStatusCode } from 'axios';
import moment from 'moment';
import { StyledTypography } from './StyledTypography';

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
        <Typography variant="subtitle1">{user.username}</Typography>
      </Box>

      {isOwner && (
        <Box sx={{ position: 'absolute', right: 8 }}>
          <IconButton size="small" onClick={onEditClick}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={handleDeleteConfirmation}>
            <Delete color="error" />
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
          <Button onClick={handleCancelDelete} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeletePost} color="error">
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
  shouldExtraDetails,
}: {
  likesCount: number;
  commentsCount: number;
  rating: number;
  shouldExtraDetails: boolean;
}) => {
  const [commentsCountState, setCommentsCountState] =
    useState<number>(commentsCount);

  const updateCommentsCount = useCallback((newCommentsCount: number) => {
    setCommentsCountState(newCommentsCount);
  }, []);

  return (
    <Box>
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.7,
              alignItems: 'center',
            }}
          >
            <Favorite sx={{ color: pink[500] }} />
            <Typography variant="subtitle1">{likesCount}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.7,
              alignItems: 'center',
            }}
          >
            <ModeComment />
            <Typography variant="subtitle1">{commentsCountState}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 0.7,
            alignItems: 'center',
          }}
        >
          <Rating name="read-only-rating" value={rating} readOnly />
        </Box>
      </Box>

      {shouldExtraDetails && (
        <PostExtraDetails
          updateCommentsCount={updateCommentsCount}
          commentsCount={commentsCountState}
        />
      )}
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

  const { postedBy, image, title, content, likesCount, commentsCount, rating } =
    postState;
  const isOwner = postedBy._id === userContext?._id;

  const handleEditClick = () => {
    setIsPostUploadModalOpen(true);
  };

  const handleModalClose = () => {
    setIsPostUploadModalOpen(false);
  };

  return (
    <StyledCard
      variant="outlined"
      tabIndex={0}
      onClick={() => !shouldExtraDetails && navigate(`/post/${postState._id}`)}
    >
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
        component="img"
        image={image}
        sx={{
          aspectRatio: '16 / 9',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />
      <StyledCardContent>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ marginLeft: 'auto' }}
        >
          {moment(postState.createdAt).fromNow()}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
          {content}
        </StyledTypography>
      </StyledCardContent>
      <BottomBar
        likesCount={likesCount}
        commentsCount={commentsCount}
        rating={rating}
        shouldExtraDetails={shouldExtraDetails}
      />
    </StyledCard>
  );
};

export default Post;
