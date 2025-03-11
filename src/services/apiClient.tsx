import axios, { AxiosError, HttpStatusCode } from 'axios';
import { CanceledError } from 'axios';
import userService from './userService';

// Axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { response: refreshResponse } = await userService.refresh();

          localStorage.setItem('accessToken', refreshResponse.data.accessToken);
          localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

          const originalRequest = error.config;
          if (originalRequest) {
            originalRequest.headers['Authorization'] = `JWT ${refreshResponse.data.accessToken}`;

            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);

          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export { CanceledError };
