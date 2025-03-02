import { apiClient } from './apiClient';
const accessToken = localStorage.getItem('accessToken');

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
  const abortController = new AbortController();
  const response = await apiClient.post('/posts/create', post, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
    signal: abortController.signal,
  });
  return { response, abort: () => abortController.abort() };
};

export default { createPost };
