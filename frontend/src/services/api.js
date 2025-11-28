import axios from 'axios';

// In Vite projects env vars should be prefixed with VITE_ and accessed
// via `import.meta.env.VITE_*`. Provide a safe fallback to localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 403:
        console.error('Forbidden:', data.message);
        break;
      case 404:
        console.error('Resource not found:', data.message);
        break;
      case 500:
        console.error('Server error:', data.message);
        break;
      default:
        console.error('API error:', data.message);
    }

    throw error;
  }
);

export default api;