import axios, { CanceledError } from 'axios';

const backend_url = 'http://localhost:3000';
export const apiClient = axios.create({
  baseURL: backend_url,
});

export { CanceledError };
