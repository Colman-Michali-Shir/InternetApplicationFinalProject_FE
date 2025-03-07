import { apiClient } from './apiClient';

export interface IComment {
  _id: string;
  user: { username: string; profileImage?: string };
  postId: string;
  content: string;
}

const accessToken = localStorage.getItem('accessToken');

const getCommentsByPostId = async (postId: string) => {
  const abortController = new AbortController();
  const response = await apiClient.get('/comments', {
    params: { postId },
    signal: abortController.signal,
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return { response, abort: () => abortController.abort() };
};

export default {
  getCommentsByPostId,
};
