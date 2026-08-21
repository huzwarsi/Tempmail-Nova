import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // On local browser testing, route directly to local Express server port 5001
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const envUrl = process.env.NEXT_PUBLIC_API_URL;
      if (envUrl) {
        return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;
      }
      return 'http://localhost:5001/api/v1';
    }

    // Prevent Mixed Content Error on Vercel/HTTPS deployment
    const customUrl = process.env.NEXT_PUBLIC_API_URL;
    if (window.location.protocol === 'https:' && customUrl?.startsWith('http:')) {
      return '/api/v1';
    }
  }

  const customUrl = process.env.NEXT_PUBLIC_API_URL;
  if (customUrl) {
    return customUrl.endsWith('/api/v1') ? customUrl : `${customUrl}/api/v1`;
  }
  return '/api/v1';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT Token if running on browser
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('tempmail_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
