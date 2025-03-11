import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { HttpStatusCode } from 'axios';
import Post from '../components/Post/Post';
import postsService, { IPost } from '../services/postsService';
import { Typography, Box, CircularProgress, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const PostPage = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [postState, setPostState] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPostById = async () => {
    if (!postId) return;

    setLoading(true);

    try {
      const { response } = await postsService.getPostById(postId);
      if (response.status === HttpStatusCode.Ok) {
        setPostState(response.data);
      } else {
        toast.error('Post not found');
      }
    } catch {
      toast.error('Error fetching post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostById();
  }, [postId]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
    >
      {loading ? (
        <CircularProgress />
      ) : postState ? (
        <Post post={postState} shouldExtraDetails={true} />
      ) : (
        <Box textAlign="center">
          <ErrorOutline sx={{ fontSize: 50, color: 'red' }} />
          <Typography variant="h6" color="error" sx={{ marginBottom: 2 }}>
            Post Not Found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default PostPage;
