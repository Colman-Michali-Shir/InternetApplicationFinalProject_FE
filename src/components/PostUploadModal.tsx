import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Rating,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { toast } from 'react-toastify';

import userService, { IUser } from '../services/userService';
import postsService, { IPost } from '../services/postsService';
import { AxiosError, HttpStatusCode } from 'axios';
import { useUserContext } from '../UserContext';

interface FormData {
  title?: string;
  content?: string;
  img?: File[];
}
const PostUploadModal = ({
  open,
  handleClose,
  storeUserSession,
  clearUserSession,
}: {
  open: boolean;
  handleClose: () => void;
  storeUserSession: (userData: { accessToken: string; refreshToken: string; user: IUser }) => void;
  clearUserSession: () => void;
}) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const { userContext } = useUserContext();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(1);
  const imageFile = watch('img');

  useEffect(() => {
    if (imageFile?.[0]) {
      setSelectedImage(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile]);

  const handleCloseModal = () => {
    handleClose();
    reset();
    setSelectedImage(null);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (userContext) {
        let imageUrl = '';
        if (data.img) {
          const uploadImageResponse = (await userService.uploadImage(data.img[0])).response;
          imageUrl = uploadImageResponse.data.url;
        }

        if (data.title && data.content && rating) {
          const postData: Omit<IPost, '_id'> = {
            postedBy: { username: userContext?.username, profileImage: userContext?.profileImage },
            title: data.title,
            content: data.content,
            image: imageUrl,
            rating,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const createPostResponse = (await postsService.createPost(postData)).response;
          if (createPostResponse.status === HttpStatusCode.Ok) {
            alert('Post created successfully!');
            handleClose();
          }
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
      const refreshToken = localStorage.getItem('refreshToken');

      if (
        error instanceof AxiosError &&
        error.response?.status === HttpStatusCode.Unauthorized &&
        refreshToken
      ) {
        try {
          const { response: refreshResponse } = await userService.refresh(refreshToken);
          if (refreshResponse.status === HttpStatusCode.Ok) {
            storeUserSession(refreshResponse.data);
            const createPostResponse = (
              await postsService.createPost(JSON.parse(error.response.config.data))
            ).response;
            if (createPostResponse.status === HttpStatusCode.Created) {
              toast.success('Upload a post successfully');
              handleCloseModal();
            } else {
              toast.error('Failed to upload post');
            }
          } else {
            clearUserSession();
          }
        } catch {
          clearUserSession();
        }
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle>Upload a Post</DialogTitle>
      <DialogContent>
        <Box component="form">
          <TextField {...register('title')} label="Title" fullWidth margin="normal" required />
          <TextField
            {...register('content')}
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Typography sx={{ mt: 2 }}>Rating:</Typography>
          <Rating value={rating} onChange={(_, newValue) => setRating(newValue)} />
          <Box mt={2} display="flex" alignItems="center">
            <input
              {...register('img')}
              type="file"
              accept="image/png, image/jpeg"
              hidden
              id="upload-button"
            />
            <label htmlFor="upload-button">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            {selectedImage && (
              <Box
                component="img"
                src={selectedImage}
                sx={{ width: '50%', height: '50%' }}
                alt="Uploaded Image"
              />
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostUploadModal;
