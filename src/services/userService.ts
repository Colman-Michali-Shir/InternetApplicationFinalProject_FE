import { CredentialResponse } from '@react-oauth/google';
import { apiClient } from './apiClient';

export interface IUser {
  email?: string;
  username: string;
  password: string;
  _id: string;
  refreshToken?: string[];
  profileImage?: string;
}

const accessToken = localStorage.getItem('accessToken');

const uploadImage = async (img: File) => {
  const abortController = new AbortController();

  const formData = new FormData();
  formData.append('file', img);
  const response = await apiClient.post('/file?file=' + img.name, formData, {
    signal: abortController.signal,

    headers: {
      'Content-Type': 'image/*',
    },
  });
  return { response, abort: () => abortController.abort() };
};

const register = async (user: Omit<IUser, '_id'>) => {
  const abortController = new AbortController();
  const response = await apiClient.post('/auth/register', user, { signal: abortController.signal });
  return { response, abort: () => abortController.abort() };
};

const googleLogin = async (credentialResponse: CredentialResponse) => {
  const abortController = new AbortController();
  const response = await apiClient.post('/auth/login', credentialResponse, {
    signal: abortController.signal,
  });
  return { response, abort: () => abortController.abort() };
};

const loginWithUsernameAndPassword = async (username: string, password: string) => {
  const abortController = new AbortController();
  const response = await apiClient.post(
    '/auth/login',
    { username, password },
    { signal: abortController.signal },
  );
  return { response, abort: () => abortController.abort() };
};

const refresh = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  const abortController = new AbortController();
  const response = await apiClient.post(
    '/auth/refresh',
    { refreshToken },
    { signal: abortController.signal },
  );
  return { response, abort: () => abortController.abort() };
};

const getUserById = async (userId: string, accessToken: string) => {
  const abortController = new AbortController();

  const response = await apiClient.get(`/users/${userId}`, {
    signal: abortController.signal,
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return { response, abort: () => abortController.abort() };
};

const updateUsername = async (userId: string, username: string) => {
  const abortController = new AbortController();
  const response = await apiClient.put(
    `/users/${userId}`,
    { username },
    {
      signal: abortController.signal,
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    },
  );
  return { response, abort: () => abortController.abort() };
};

const updateProfileImage = async (userId: string, profileImage: string) => {
  const abortController = new AbortController();
  const response = await apiClient.put(
    `/users/${userId}`,
    { profileImage },
    {
      signal: abortController.signal,
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    },
  );
  return { response, abort: () => abortController.abort() };
};

export default {
  register,
  googleLogin,
  uploadImage,
  getUserById,
  updateUsername,
  updateProfileImage,
  loginWithUsernameAndPassword,
  refresh,
};
