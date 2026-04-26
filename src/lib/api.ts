import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_X_API_KEY,
  },
});

// Interceptor to add auth token if available
// Note: In a real app, you'd use Clerk's getToken() in a hook or provider
// and set this dynamically. This is a baseline setup.
api.interceptors.request.use(
  (config) => {
    // Add logic here to include tokens from local storage or state
    // For Clerk, it's usually better to use the useAuth() hook in components
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
