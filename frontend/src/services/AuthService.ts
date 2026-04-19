import apiService from './ApiService';

/**
 * Service for handling user authentication and profile data.
 */
class AuthService {
  public async login(payload: any): Promise<any> {
    const response = await apiService.post('/auth/login', payload);
    return response.data;
  }

  public async register(payload: any): Promise<any> {
    const response = await apiService.post('/auth/register', payload);
    return response.data;
  }

  public async logout(): Promise<any> {
    return apiService.post('/auth/logout');
  }

  public async getProfile(): Promise<any> {
    const response = await apiService.get('/users/me');
    return response.data.data;
  }

  public async checkHealth(): Promise<any> {
    return apiService.get('/health');
  }
}

const authService = new AuthService();
export default authService;
