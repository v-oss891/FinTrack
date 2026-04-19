import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Base API Service for handling HTTP requests.
 */
class ApiService {
  public apiBaseUrl: string;
  public client: AxiosInstance;

  constructor() {
    this.apiBaseUrl = this._buildBaseUrl();
    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: 10000,
    });

    this._setupInterceptors();
  }

  private _buildBaseUrl(): string {
    const rawBase = (process.env.REACT_APP_API_URL || '').trim().replace(/\/+$/, '');
    return rawBase
      ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`)
      : '/api';
  }

  private _setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('fintrack_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  public getErrorMessage(error: any): string {
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

  public async get(url: string, config: AxiosRequestConfig = {}) {
    return this.client.get(url, config);
  }

  public async post(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return this.client.post(url, data, config);
  }

  public async put(url: string, data: any = {}, config: AxiosRequestConfig = {}) {
    return this.client.put(url, data, config);
  }

  public async delete(url: string, config: AxiosRequestConfig = {}) {
    return this.client.delete(url, config);
  }
}

const apiService = new ApiService();
export default apiService;
