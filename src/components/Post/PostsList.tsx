import { useState, useEffect } from 'react';
import { Box, Grid2, Typography, CircularProgress } from '@mui/material';
import { HttpStatusCode } from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import Post from '../../components/Post/Post';
import { IPost } from '../../services/postsService';
import postService from '../../services/postsService';
import { useUserContext } from '../../UserContext';

const PostsList = ({ getAll = false }: { getAll: boolean }) => {
  const { userContext } = useUserContext();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [lastPostId, setLastPostId] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const fetchPosts = async () => {
    const userId = getAll ? undefined : userContext?._id;
    try {
      const response = (await postService.getPosts(userId, lastPostId)).response;
      if (response.status === HttpStatusCode.Ok) {
        const newPosts = response.data.posts;
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        setLastPostId(newPosts.length > 0 ? newPosts[newPosts.length - 1]._id : null);
        setHasMore(newPosts.length > 0);
      } else {
        toast.error('Failed to load posts.');
      }
    } catch {
      toast.error('Error fetching posts.');
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

  return (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Typography align="center" mt={2} color="textSecondary">
            No more posts to show 🎉
          </Typography>
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
