import { apiClient } from './apiClient';

export interface IPost {
  _id: string;
  title: string;
  content: string;
  image?: string;
  postedBy: { username: string; profileImage?: string };
  likesCount: number;
  commentsCount: number;
  rating: number;
}

const accessToken = localStorage.getItem('accessToken');

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

export default {
  getPosts,
};
