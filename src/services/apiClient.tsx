import axios, { CanceledError } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Ensures cookies & headers are sent in cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export { CanceledError };
