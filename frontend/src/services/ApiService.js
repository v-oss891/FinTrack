import axios from 'axios';

/**
 * Base API Service for handling HTTP requests.
 */
class ApiService {
  constructor() {
    this.apiBaseUrl = this._buildBaseUrl();
    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 10000,
    });

    this._setupInterceptors();
  }

  _buildBaseUrl() {
    const rawBase = (process.env.REACT_APP_API_URL || '').trim().replace(/\/+$/, '');
    return rawBase
      ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`)
      : '/api';
  }

  _setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('fintrack_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  getErrorMessage(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.code === 'ECONNABORTED') {
      return 'The FinTrack API timed out. Check whether the backend and MongoDB are running.';
    }

    if (!error.response) {
      return this.apiBaseUrl === '/api'
        ? 'Cannot reach the FinTrack API through the local proxy. Make sure the backend is running on port 8000 and MongoDB is connected.'
        : `Cannot reach the FinTrack API at ${this.apiBaseUrl}. Start the backend on port 8000 and make sure MongoDB is connected.`;
    }

    return 'The request could not be completed. Please try again.';
  }

  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

const apiService = new ApiService();
export default apiService;
