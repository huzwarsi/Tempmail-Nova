import axios from 'axios';

const getBaseURL = () => {
  const customUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && customUrl?.startsWith('http:')) {
    // Prevent Mixed Content Error on Vercel HTTPS by using Next.js server rewrites proxy
    return '/api/v1';
  }
  return customUrl ? `${customUrl}/api/v1` : '/api/v1';
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
