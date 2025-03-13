import { useState, useCallback } from 'react';
import { Box, IconButton, Typography, Rating } from '@mui/material';
import { ModeComment, Favorite, FavoriteBorder } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import CommentsList from '../Comment/CommentsList';
import likesService from '../../services/likesService';
import { toast } from 'react-toastify';
import { HttpStatusCode } from 'axios';

const PostBottomBar = ({
  likesCount,
  commentsCount,
  rating,
  likedByCurrentUser = false,
  shouldExtraDetails,
  postId,
}: {
  likesCount: number;
  commentsCount: number;
  rating: number;
  likedByCurrentUser: boolean;
  shouldExtraDetails: boolean;
  postId: string;
}) => {
  const [commentsCountState, setCommentsCountState] =
    useState<number>(commentsCount);
  const [likesCountState, setLikesCountState] = useState<number>(likesCount);

  const updateCommentsCount = useCallback((newCommentsCount: number) => {
    setCommentsCountState(newCommentsCount);
  }, []);

  const handleLike = async () => {
    if (postId) {
      try {
        const { response } = await likesService.addLike(postId);
        if (response.status === HttpStatusCode.Ok) {
          console.log('liked');
          setLikesCountState(likesCount + 1);
          likedByCurrentUser = true;
        }
      } catch {
        toast.error('Error liking post');
      }
    }
  };

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
            {likedByCurrentUser ? (
              <IconButton>
                <Favorite sx={{ color: pink[500] }} />
              </IconButton>
            ) : (
              <IconButton onClick={handleLike}>
                <FavoriteBorder />
              </IconButton>
            )}
            <Typography variant='subtitle1'>{likesCountState}</Typography>
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
            <Typography variant='subtitle1'>{commentsCountState}</Typography>
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
          <Rating name='read-only-rating' value={rating} readOnly />
        </Box>
      </Box>

      {shouldExtraDetails && (
        <CommentsList
          updateCommentsCount={updateCommentsCount}
          commentsCount={commentsCountState}
        />
      )}
    </Box>
  );
};

export default PostBottomBar;
