import axios from 'axios';

// Build a clean API base URL.
// - Trim whitespace (guards against trailing spaces in .env on Render/Vercel)
// - Strip any trailing slashes
// - Ensure exactly one "/api" suffix
const rawBase = (process.env.REACT_APP_API_URL || '').trim().replace(/\/+$/, '');
const withApi = rawBase
  ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`)
  : '/api'; // dev fallback uses CRA proxy to localhost:8000

export const apiBaseUrl = withApi;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getApiErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === 'ECONNABORTED') {
    return 'The FinTrack API timed out. Check whether the backend and MongoDB are running.';
  }

  if (!error.response) {
    return apiBaseUrl === '/api'
      ? 'Cannot reach the FinTrack API through the local proxy. Make sure the backend is running on port 8000 and MongoDB is connected.'
      : `Cannot reach the FinTrack API at ${apiBaseUrl}. Start the backend on port 8000 and make sure MongoDB is connected.`;
  }

  return 'The request could not be completed. Please try again.';
};

export default api;
