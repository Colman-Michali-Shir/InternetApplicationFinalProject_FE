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
    // Check for Unauthorized error and if we have a refresh token
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const { response: refreshResponse } = await userService.refresh(refreshToken);

          // Store the new access token
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);
          localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
          // Retry the original request with the new token
          const originalRequest = error.config;
          if (originalRequest) {
            // Return the retry request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          // Optional: Handle refresh failure (e.g., log out the user)
          // For example: redirect to login page, or clear tokens
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Redirect to login or handle accordingly
        }
      }
    }

    // If error is not related to authorization, or no refresh token available, reject the error
    return Promise.reject(error);
  },
);

export { CanceledError };
