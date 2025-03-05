import { useState, useEffect } from 'react';
import { HttpStatusCode } from 'axios';
import { Box, Divider, Grid2, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProfileData from '../components/ProfileData';
import { IPost } from '../services/postsService';
import postService from '../services/postsService';
import { useUserContext } from '../UserContext';
import Post from '../components/Post';

const Profile = () => {
  const { userContext } = useUserContext();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [lastPostId, setLastPostId] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    const userId = userContext?._id || localStorage.getItem('userId');
    if (!userId) {
      return;
    }
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
    } catch (err) {
      toast.error('Error fetching posts.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="4">
      <ProfileData />
      <Divider sx={{ my: 3 }} />
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
            <Grid2 size={{ md: 6 }}>
              <Post key={post._id} post={post} />
            </Grid2>
          ))}
        </Grid2>
      </InfiniteScroll>
    </Box>
  );
};

export default Profile;
