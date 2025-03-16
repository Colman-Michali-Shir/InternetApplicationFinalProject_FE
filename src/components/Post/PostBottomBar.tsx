import React, { useState, useCallback } from 'react';
import { Box, IconButton, Typography, Rating } from '@mui/material';
import { ModeComment, Favorite, FavoriteBorder } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import CommentsList from '../Comment/CommentsList';

const PostBottomBar = React.memo(
  ({
    likesCount,
    commentsCount,
    rating,
    likedByCurrentUser = false,
    shouldExtraDetails,
    handleLike,
    handleRemoveLike,
  }: {
    likesCount: number;
    commentsCount: number;
    rating: number;
    likedByCurrentUser: boolean;
    shouldExtraDetails: boolean;
    handleLike: () => void;
    handleRemoveLike: () => void;
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
              {likedByCurrentUser ? (
                <IconButton onClick={handleRemoveLike}>
                  <Favorite sx={{ color: pink[500] }} />
                </IconButton>
              ) : (
                <IconButton onClick={handleLike}>
                  <FavoriteBorder />
                </IconButton>
              )}
              <Typography variant='subtitle1'>{likesCount}</Typography>
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
  }
);

export default PostBottomBar;
