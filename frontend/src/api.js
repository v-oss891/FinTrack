import axios from 'axios';

export const apiBaseUrl = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl + '/api',
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
