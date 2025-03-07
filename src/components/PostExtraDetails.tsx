import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Rating,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import commentsService, { IComment } from '../services/commentsService';
import { HttpStatusCode } from 'axios';
import { IPost } from '../services/postsService';

const PostExtraDetails = ({ post }: { post: IPost }) => {
  //   const { id } = useParams();
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);

  //   if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { response } = await commentsService.getCommentsByPostId(post._id);
        if (response.status === HttpStatusCode.Ok) {
          setComments(response.data);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [post]);

  return loading ? (
    <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />
  ) : (
    <List>
      {comments.map((comment, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={comment.user.username} src={comment.user.profileImage} />
          </ListItemAvatar>
          <ListItemText
            primary={comment.user.username}
            secondary={
              <Typography variant="body2" color="text.secondary">
                {comment.content}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default PostExtraDetails;
