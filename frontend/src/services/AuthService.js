import apiService from './ApiService';

/**
 * Service for handling user authentication and profile data.
 */
class AuthService {
  async login(payload) {
    const response = await apiService.post('/auth/login', payload);
    return response.data;
  }

  async register(payload) {
    const response = await apiService.post('/auth/register', payload);
    return response.data;
  }

  async logout() {
    return apiService.post('/auth/logout');
  }

  async getProfile() {
    const response = await apiService.get('/users/me');
    return response.data.data;
  }

  async checkHealth() {
    return apiService.get('/health');
  }
}

const authService = new AuthService();
export default authService;
