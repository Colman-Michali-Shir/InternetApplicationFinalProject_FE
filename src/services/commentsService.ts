import { apiClient } from './apiClient';

export interface IComment {
  _id: string;
  user: { _id: string; username: string; profileImage?: string };
  postId: string;
  content: string;
}

const getCommentsByPostId = async (postId: string, lastCommentId?: string) => {
  const abortController = new AbortController();
  const params = new URLSearchParams();
  params.append('postId', postId);
  if (lastCommentId) params.append('lastCommentId', lastCommentId);
  const response = await apiClient.get(`/comments?${params.toString()}`, {
    signal: abortController.signal,
  });
  return { response, abort: () => abortController.abort() };
};

const deleteComment = async (commentId: string) => {
  const abortController = new AbortController();
  const response = await apiClient.delete(`/comments/${commentId}`, {
    signal: abortController.signal,
  });
  return { response, abort: () => abortController.abort() };
};

const createComment = async (comment: Omit<IComment, '_id' | 'user'>) => {
  const abortController = new AbortController();
  const response = await apiClient.post('/comments', comment, {
    signal: abortController.signal,
  });
  return { response, abort: () => abortController.abort() };
};

const updateComment = async (commentId: string, updateComment: string) => {
  const abortController = new AbortController();
  const response = await apiClient.put(
    `/comments/${commentId}`,
    { content: updateComment },
    {
      signal: abortController.signal,
    }
  );
  return { response, abort: () => abortController.abort() };
};

export default {
  getCommentsByPostId,
  updateComment,
  deleteComment,
  createComment,
};
