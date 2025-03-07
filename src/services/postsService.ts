import { apiClient } from './apiClient';

export interface IPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  postedBy: { _id: string; username: string; profileImage?: string };
  likesCount: number;
  commentsCount: number;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const accessToken = localStorage.getItem('accessToken');

export interface IPostDB extends Omit<IPost, 'postedBy'> {
  postedBy: string;
}
const createPost = async (post: Omit<IPostDB, '_id'>) => {
  const abortController = new AbortController();
  const response = await apiClient.post('/posts', post, {
    signal: abortController.signal,
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return { response, abort: () => abortController.abort() };
};

const editPost = async (post: IPostDB) => {
  const abortController = new AbortController();
  const response = await apiClient.put(`/posts/${post._id}`, post, {
    signal: abortController.signal,
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return { response, abort: () => abortController.abort() };
};

const deletePost = async (postId: string) => {
  const abortController = new AbortController();
  const response = await apiClient.delete(`/posts/${postId}`, {
    signal: abortController.signal,
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return { response, abort: () => abortController.abort() };
};

const getPosts = async (postedBy?: string, lastPostId?: string) => {
  const abortController = new AbortController();
  const params = new URLSearchParams();
  if (postedBy) params.append('postedBy', postedBy);
  if (lastPostId) params.append('lastPostId', lastPostId);
  const response = await apiClient.get(`/posts?${params.toString()}`, {
    signal: abortController.signal,
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return { response, abort: () => abortController.abort() };
};

export default { createPost, editPost, deletePost, getPosts };
