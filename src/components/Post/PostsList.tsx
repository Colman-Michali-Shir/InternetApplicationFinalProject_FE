import { useState, useEffect } from 'react';
import { Box, Grid2, CircularProgress } from '@mui/material';
import { HttpStatusCode } from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import Post from '../../components/Post/Post';
import postService from '../../services/postsService';
import { useUserContext } from '../../Context/UserContext';
import { usePostContext } from '../../Context/PostsContext';

const PostsList = ({ shouldGetAll = false }: { shouldGetAll: boolean }) => {
  const { userContext } = useUserContext();
  const { postsContext, addMultiplePosts, clearStates, setEndOfList } =
    usePostContext();
  const [lastPostId, setLastPostId] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    if (loading) return;

    setLoading(true);

    const userId = shouldGetAll ? undefined : userContext?._id;
    try {
      const { response } = await postService.getPosts(userId, lastPostId);
      if (response.status === HttpStatusCode.Ok) {
        const newPosts = response.data.posts;
        addMultiplePosts(newPosts);
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
    setLastPostId(
      postsContext.length > 0
        ? postsContext[postsContext.length - 1]._id
        : undefined
    );
  }, [postsContext]);

  useEffect(() => {
    setEndOfList(hasMore);
  }, [hasMore]);

  const clearState = () => {
    clearStates();
    setHasMore(false);
    setLastPostId(undefined);
  };

  useEffect(() => {
    fetchPosts();
    return () => {
      clearState();
    };
  }, []);

  return (
    <>
      <InfiniteScroll
        dataLength={postsContext.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={
          <Box display='flex' justifyContent='center' mt={2}>
            {loading && <CircularProgress />}
          </Box>
        }
        style={{ overflow: 'visible' }}
      >
        <Grid2 container spacing={3}>
          {postsContext.map((post) => (
            <Grid2 size={{ md: 6 }} key={post._id}>
              <Post key={post._id} post={post} />
            </Grid2>
          ))}
        </Grid2>
      </InfiniteScroll>
    </>
  );
};

export default PostsList;
