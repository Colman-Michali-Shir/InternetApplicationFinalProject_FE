import { apiClient } from './apiClient';

export interface IPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  postedBy: { username: string; profileImage?: string };
  likesCount: number;
  commentsCount: number;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const createPost = async (post: Omit<IPost, '_id'>) => {
  const accessToken = localStorage.getItem('accessToken');

  const abortController = new AbortController();
  console.log('ssssssssssssssssssss', post);
  const response = await apiClient.post('/posts', post, {
    signal: abortController.signal,
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return { response, abort: () => abortController.abort() };
};

const getPosts = async (postedBy?: string, lastPostId?: string) => {
  const accessToken = localStorage.getItem('accessToken');

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

export default { createPost, getPosts };
