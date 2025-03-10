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
import { useCallback, useRef, useState } from 'react';
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
        toast.success('Post deleted successfully');
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
        padding: '16px',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar alt={user.username} src={user.profileImage} sx={{ width: 24, height: 24 }} />
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
  commentsCountRef,
}: {
  likesCount: number;
  commentsCount: number;
  rating: number;
  commentsCountRef: React.RefObject<HTMLSpanElement | null>;
}) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Favorite sx={{ color: pink[500] }} />
        <Typography variant="subtitle1">{likesCount}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ModeComment />
        <Typography ref={commentsCountRef} variant="subtitle1">
          {commentsCount}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating name="read-only-rating" value={rating} readOnly />
    </Box>
  </Box>
);

const Post = ({ post }: { post?: IPost }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isPostUploadModalOpen, setIsPostUploadModalOpen] = useState(false);
  const { userContext } = useUserContext();

  const [postState, setPostState] = useState<IPost>(state?.post || post);
  const shouldExtraDetailsState = state?.shouldExtraDetails ?? false;
  const { postedBy, image, title, content, likesCount, commentsCount, rating } = postState || {};
  const isOwner = postedBy._id === userContext?._id;

  const commentsCountRef = useRef<HTMLSpanElement>(null);

  const updateCommentsCount = useCallback(() => {
    if (commentsCountRef.current) {
      commentsCountRef.current.textContent = (
        (Number(commentsCountRef.current.textContent) || 0) + 1
      ).toString();
    }
  }, []);

  const handleEditClick = () => {
    setIsPostUploadModalOpen(true);
  };

  const handleModalClose = () => {
    setIsPostUploadModalOpen(false);
  };

  return (
    <>
      {postState && (
        <Card
          variant="outlined"
          sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
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
            onEditClick={handleEditClick}
            onClose={handleModalClose}
            isPostUploadModalOpen={isPostUploadModalOpen}
            setPostState={setPostState}
          />
          <CardMedia
            component="img"
            image={image}
            sx={{ aspectRatio: '16 / 9', borderBottom: '1px solid', borderColor: 'divider' }}
          />
          <CardContent sx={{ flexGrow: 1, padding: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 'auto' }}>
              {moment(postState.createdAt).fromNow()}
            </Typography>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <StyledTypography variant="body2" color="text.secondary" gutterBottom>
              {content}
            </StyledTypography>
          </CardContent>
          <BottomBar
            commentsCountRef={commentsCountRef}
            likesCount={likesCount}
            commentsCount={commentsCount}
            rating={rating}
          />
          {shouldExtraDetailsState && (
            <PostExtraDetails updateCommentsCount={updateCommentsCount} />
          )}
        </Card>
      )}
    </>
  );
};

export default Post;
