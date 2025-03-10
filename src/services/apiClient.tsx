import axios, { AxiosError, HttpStatusCode } from 'axios';
import { CanceledError } from 'axios';
import userService from './userService';

// Axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Ensures cookies & headers are sent in cross-origin requests
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

// Interceptor to handle token refresh on Unauthorized error
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Refresh token
          const refreshResponse = await userService.refresh(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } =
            refreshResponse.response.data;

          // Store new tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request
          return apiClient({
            ...error.config, // Clone the original request config
            headers: {
              ...error.config?.headers, // Preserve existing headers
              Authorization: `JWT ${accessToken}`, // Inject new token
            },
          });
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);

          // Clear tokens and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';

          return Promise.reject(refreshError);
        }
      }
    }

    // If error is not related to authorization, or no refresh token available, reject the error
    return Promise.reject(error);
  },
);

export { CanceledError };
