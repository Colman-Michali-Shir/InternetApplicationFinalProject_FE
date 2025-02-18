import axios, { CanceledError } from "axios";

export { CanceledError };

const backend_url = import.meta.env.BACKEND_URL
const apiClient = axios.create({
    baseURL: backend_url,
});

export default { apiClient };