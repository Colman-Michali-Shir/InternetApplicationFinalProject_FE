import { useEffect, useState } from 'react';
import {
  CircularProgress,
  List,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import commentsService, { IComment } from '../../services/commentsService';
import { HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';
import Comment from './Comment';
import { useUserContext } from '../../UserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import React from 'react';
import { useParams } from 'react-router-dom';

const PostExtraDetails = React.memo(
  ({
    updateCommentsCount,
    commentsCount,
  }: {
    updateCommentsCount: (newCommentsCount: number) => void;
    commentsCount: number;
  }) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState(true);
    const { userContext } = useUserContext();
    const limit = 5;
    const { id: postId } = useParams();

    const fetchCommentsByPostId = async () => {
      if (postId) {
        if (loading) return;

        setLoading(true);

        try {
          const { response } = await commentsService.getCommentsByPostId(
            postId,
            currentPage,
          );
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
      }
    };

    useEffect(() => {
      fetchCommentsByPostId();
    }, [currentPage]);

    const onDeleteComment = (commentId: string) => {
      updateCommentsCount(commentsCount - 1);
      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== commentId),
      );
    };

    const onEditComment = (updatedComment: IComment) => {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment,
        ),
      );
    };

    const handleAddComment = async () => {
      if (postId) {
        if (!newComment.trim()) {
          toast.error('Comment cannot be empty');
          return;
        }

        try {
          const { response } = await commentsService.createComment({
            postId,
            content: newComment,
          });

          if (response.status === HttpStatusCode.Created) {
            setComments((prevComments) => [
              ...prevComments,
              { user: userContext, ...response.data },
            ]);
            setNewComment('');
            updateCommentsCount(commentsCount + 1);
          }
        } catch {
          toast.error('Error adding comment');
        }
      }
    };

    return (
      <Box>
        <InfiniteScroll
          dataLength={comments.length}
          next={() => setCurrentPage((prev) => prev + 1)}
          hasMore={hasMore}
          loader={
            loading && (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            )
          }
          endMessage={
            <Typography
              component="div"
              align="center"
              mt={2}
              color="textSecondary"
            >
              No more comments to show 🎉
            </Typography>
          }
          style={{ overflow: 'visible' }}
          scrollableTarget="comments-list"
        >
          <Box
            sx={{
              maxHeight: '300px',
              overflowY: 'auto',
            }}
            id="comments-list"
          >
            <List id="comments-list">
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
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => setNewComment(e.target.value)}
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
