import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

import userService from '../services/userService';
import postsService, { IPost, IPostDB } from '../services/postsService';
import { HttpStatusCode } from 'axios';
import { useUserContext } from '../UserContext';

interface FormData {
  title?: string;
  content?: string;
  rating?: number;
  img?: File[];
}
const SavePostModal = ({
  post,
  open,
  handleClose,
  setPostState,
  // storeUserSession,
  // clearUserSession,
}: {
  post?: IPost;
  open: boolean;
  handleClose: () => void;
  setPostState?: React.Dispatch<React.SetStateAction<IPost>>;

  // storeUserSession: (userData: { accessToken: string; refreshToken: string; user: IUser }) => void;
  // clearUserSession: () => void;
}) => {
  const { register, handleSubmit, watch, reset, control } = useForm<FormData>({
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      rating: post?.rating || 0,
    },
  });
  const imageFile = watch('img');
  const title = watch('title');
  const rating = watch('rating');

  const { userContext } = useUserContext();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isSubmitDisabled = !title || !imageFile?.length || !rating;

  useEffect(() => {
    if (post?.image) {
      setSelectedImage(post.image);
    }
  }, [post]);

  useEffect(() => {
    if (imageFile?.[0]) {
      console.log('2');

      setSelectedImage(URL.createObjectURL(imageFile[0]));
    }
  }, [imageFile]);

  const handleCloseModal = () => {
    handleClose();
    reset();
    setSelectedImage(null);
  };

  const onSubmit = async ({ title, content, img, rating }: FormData) => {
    try {
      if (userContext) {
        if (img && title && rating) {
          const uploadImageResponse = (await userService.uploadImage(img[0])).response;
          const imageUrl = uploadImageResponse.data.url;

          const postData: Omit<IPostDB, '_id'> = {
            postedBy: userContext._id,
            title: title,
            content,
            image: imageUrl,
            rating: rating,
            likesCount: 0,
            commentsCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          if (post) {
            const editPostResponse = (await postsService.updatePost({ ...postData, _id: post._id }))
              .response;
            if (editPostResponse.status === HttpStatusCode.Ok) {
              setPostState?.(editPostResponse.data);
              toast.success('Edit a post successfully');
              handleCloseModal();
            } else {
              toast.error('Failed to edit post');
            }
          } else {
            const createPostResponse = (await postsService.createPost(postData)).response;
            if (createPostResponse.status === HttpStatusCode.Created) {
              toast.success('Upload a post successfully');
              handleCloseModal();
            } else {
              toast.error('Failed to upload post');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
      // const refreshToken = localStorage.getItem('refreshToken');

      // if (
      //   error instanceof AxiosError &&
      //   error.response?.status === HttpStatusCode.Unauthorized &&
      //   refreshToken
      // ) {
      //   try {
      //     const { response: refreshResponse } = await userService.refresh(refreshToken);
      //     if (refreshResponse.status === HttpStatusCode.Ok) {
      //       storeUserSession(refreshResponse.data);
      //       const createPostResponse = (
      //         await postsService.createPost(JSON.parse(error.response.config.data))
      //       ).response;
      //       if (createPostResponse.status === HttpStatusCode.Created) {
      //         toast.success('Upload a post successfully');
      //         handleCloseModal();
      //       } else {
      //         toast.error('Failed to upload post');
      //       }
      //     } else {
      //       clearUserSession();
      //     }
      //   } catch {
      //     clearUserSession();
      //   }
      // }
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <DialogTitle color="primary" sx={{ fontWeight: 'bold' }}>
        {post ? 'Edit Post' : 'Upload a Post'}
      </DialogTitle>
      <DialogContent>
        <Box component="form">
          <TextField
            {...register('title')}
            label="Enter restaurant name"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            {...register('content')}
            label="You can provide more details"
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Typography sx={{ mt: 2 }}>Rating</Typography>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => <Rating {...field} />}
          />
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
        <Button
          disabled={isSubmitDisabled}
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          {post ? 'Edit' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavePostModal;
