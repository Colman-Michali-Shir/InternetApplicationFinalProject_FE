import { useState, useEffect } from 'react';
import { Box, Grid2, CircularProgress } from '@mui/material';
import { HttpStatusCode } from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import Post from '../../components/Post/Post';
import { IPost } from '../../services/postsService';
import postService from '../../services/postsService';
import { useUserContext } from '../../Context/UserContext';

const PostsList = ({
  shouldGetAll = false,
  shouldReFetch,
  setShouldReFetch,
}: {
  shouldGetAll: boolean;
  shouldReFetch: boolean;
  setShouldReFetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { userContext } = useUserContext();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [lastPostId, setLastPostId] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

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
          newPosts.length > 0 ? newPosts[newPosts.length - 1]._id : null
        );
        setHasMore(newPosts.length > 0);
      } else {
        toast.error('Failed to load posts.');
      }
    } catch {
      toast.error('Error fetching posts.');
    } finally {
      setLoading(false);
      setShouldReFetch(false);
    }
  };

  const clearState = () => {
    setPosts(() => []);
    setLastPostId(undefined);
    setHasMore(false);
  };

  useEffect(() => {
    fetchPosts();
    return () => {
      clearState();
    };
  }, []);

  useEffect(() => {
    if (shouldReFetch) {
      clearState();
    }
  }, [shouldReFetch]);

  useEffect(() => {
    if (shouldReFetch && posts.length === 0) {
      fetchPosts();
    }
  }, [shouldReFetch, posts]);

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
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
          {posts.map((post) => (
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
