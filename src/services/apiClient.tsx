import axios, { AxiosError, HttpStatusCode } from 'axios';
import { CanceledError } from 'axios';
import userService from './userService';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `JWT ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const refreshResponse = await userService.refresh();
          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.response.data;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          return apiClient({
            ...error.config,
            headers: {
              ...error.config?.headers,
              Authorization: `JWT ${accessToken}`,
            },
          });
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);

          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);

export { CanceledError };
