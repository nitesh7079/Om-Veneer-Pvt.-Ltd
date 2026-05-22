import axios from 'axios';
import { cacheGet, cacheSet } from './cache';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-ju5k.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Cached GET request — returns cached data instantly if available,
 * otherwise fetches from the server and caches the result.
 * @param {string} url - API endpoint
 * @param {number} [ttlMs] - Cache lifetime in ms (default 2 minutes)
 */
export const cachedGet = async (url, ttlMs) => {
  const cached = cacheGet(url);
  if (cached) return cached;

  const response = await api.get(url);
  cacheSet(url, response, ttlMs);
  return response;
};

export default api;
