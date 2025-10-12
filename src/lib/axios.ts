import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333/',
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to login
      window.location.href = '/log-in';
    }

    return Promise.reject(error);
  }
);
