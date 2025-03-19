import { useState, useEffect } from 'react';
import { Box, Grid2, CircularProgress, Fab } from '@mui/material';
import { HttpStatusCode } from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import Post from '../../components/Post/Post';
import postService, { IPost } from '../../services/postsService';
import { useUserContext } from '../../Context/UserContext';
import SavePostModal from './SavePostModal';
import { Add } from '@mui/icons-material';

const PostsList = ({ shouldGetAll = false }: { shouldGetAll: boolean }) => {
  const { userContext } = useUserContext();
  const [lastPostId, setLastPostId] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isPostUploadModalOpen, setIsPostUploadModalOpen] = useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  const handleUploadOpen = () => {
    setIsPostUploadModalOpen(true);
  };

  const handleUploadClose = () => {
    setIsPostUploadModalOpen(false);
  };

  const fetchPosts = async () => {
    if (loading) return;

    setLoading(true);

    const userId = shouldGetAll ? undefined : userContext?._id;
    try {
      const { response } = await postService.getPosts(userId, lastPostId);
      if (response.status === HttpStatusCode.Ok) {
        const newPosts = response.data.posts;
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setLastPostId(
          newPosts.length > 0 ? newPosts[newPosts.length - 1]._id : null,
        );
        setHasMore(newPosts.length > 0);
      } else {
        toast.error('Failed to load posts.');
      }
    } catch {
      toast.error('Error fetching posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    return () => {
      setPosts([]);
      setLastPostId(undefined);
      setHasMore(false);
    };
  }, []);

  const addPostToList = (newPost: IPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={
          <Box display="flex" justifyContent="center" mt={2}>
            {loading && <CircularProgress />}
          </Box>
        }
        style={{ overflow: 'visible' }}
      >
        <Grid2 container spacing={3}>
          {posts.map((post) => (
            <Grid2 size={{ md: 6 }} key={post._id}>
              <Post key={post._id} post={post} />
            </Grid2>
          ))}
        </Grid2>
      </InfiniteScroll>
      <Fab
        color="primary"
        aria-label="Upload"
        onClick={handleUploadOpen}
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          boxShadow: 3,
        }}
      >
        <Add />
      </Fab>
      <SavePostModal
        open={isPostUploadModalOpen}
        handleClose={handleUploadClose}
        addPostToList={addPostToList}
      />
    </>
  );
};

export default PostsList;
