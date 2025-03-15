import { apiClient } from './apiClient';

export interface ILike {
  _id: string;
  user: { _id: string; username: string; profileImage?: string };
  postId: string;
}

const addLike = async (postId: string) => {
  const abortController = new AbortController();
  const response = await apiClient.post(
    '/likes',
    { postId },
    {
      signal: abortController.signal,
    }
  );
  return { response, abort: () => abortController.abort() };
};

const removeLike = async (postId: string) => {
  const abortController = new AbortController();
  const response = await apiClient.delete(`/likes/${postId}`, {
    signal: abortController.signal,
  });
  return { response, abort: () => abortController.abort() };
};

export default {
  addLike,
  removeLike,
};
