import { useEffect, useState } from 'react';
import { CircularProgress, List, TextField, Button, Box, Typography } from '@mui/material';
import commentsService, { IComment } from '../services/commentsService';
import { HttpStatusCode } from 'axios';
import { IPost } from '../services/postsService';
import { toast } from 'react-toastify';
import Comment from './Comment';
import { useUserContext } from '../UserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import React from 'react';

const PostExtraDetails = React.memo(
  ({
    post,
    updateCommentsCount,
  }: {
    post: IPost;
    updateCommentsCount: () => void; // Accept callback to update commentsCount
  }) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState(true);
    const { userContext } = useUserContext();
    const limit = 5;

    const fetchCommentsByPostId = async () => {
      if (loading) return;

      setLoading(true);

      try {
        const { response } = await commentsService.getCommentsByPostId(post._id, currentPage);
        if (response.status === HttpStatusCode.Ok) {
          const newComments = response.data;

          setComments((prevComments) => [...prevComments, ...newComments]);
          setHasMore(newComments.length === limit);
        }
      } catch {
        toast.error('Error fetching comments');
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchCommentsByPostId();
    }, [currentPage]);

    const onDeleteComment = (commentId: string) => {
      setComments((prevComments) => prevComments.filter((c) => c._id !== commentId));
    };

    const onEditComment = (updatedComment: IComment) => {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment,
        ),
      );
    };

    const handleAddComment = async () => {
      if (!newComment.trim()) {
        toast.error('Comment cannot be empty');
        return;
      }

      try {
        const { response } = await commentsService.createComment({
          postId: post._id,
          content: newComment,
        });

        if (response.status === HttpStatusCode.Created) {
          setComments((prevComments) => [...prevComments, { user: userContext, ...response.data }]);
          setNewComment('');
          //TODO: fix it
          // updateCommentsCount();
          toast.success('Comment added successfully');
        }
      } catch {
        toast.error('Error adding comment');
      }
    };

    return loading ? (
      <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />
    ) : (
      <Box display="flex" flexDirection="column" gap="4">
        <InfiniteScroll
          dataLength={comments.length}
          next={() => setCurrentPage((prevPage) => prevPage + 1)}
          hasMore={hasMore}
          loader={
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          }
          endMessage={
            <Typography align="center" mt={2} color="textSecondary">
              No more comments to show 🎉
            </Typography>
          }
          style={{ overflow: 'visible' }}
        >
          <Box
            sx={{
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <List>
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onDelete={onDeleteComment}
                  onEdit={onEditComment}
                />
              ))}
            </List>
          </Box>
        </InfiniteScroll>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
          <TextField
            label="Add a comment"
            multiline
            rows={4}
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setNewComment(e.target.value)
            }
            variant="outlined"
          />
          <Button
            variant="contained"
            disabled={!newComment}
            onClick={handleAddComment}
            color="primary"
          >
            Add Comment
          </Button>
        </Box>
      </Box>
    );
  },
);

export default PostExtraDetails;
