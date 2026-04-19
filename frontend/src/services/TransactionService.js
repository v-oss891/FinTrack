import apiService from './ApiService';
import Transaction from '../models/Transaction';

/**
 * Service for managing transactions on the frontend.
 */
class TransactionService {
  async getTransactions(params = {}) {
    const response = await apiService.get('/transactions', { params });
    return {
      data: response.data.data.map((t) => new Transaction(t)),
      meta: response.data.meta,
    };
  }

  async getTransaction(id) {
    const response = await apiService.get(`/transactions/${id}`);
    return new Transaction(response.data.data);
  }

  async createTransaction(payload) {
    const response = await apiService.post('/transactions', payload);
    return new Transaction(response.data.data);
  }

  async updateTransaction(id, payload) {
    const response = await apiService.put(`/transactions/${id}`, payload);
    return new Transaction(response.data.data);
  }

  async deleteTransaction(id) {
    return apiService.delete(`/transactions/${id}`);
  }

  getExportUrl(params = {}) {
    const query = new URLSearchParams(params).toString();
    return `${apiService.apiBaseUrl}/transactions/export/csv${query ? `?${query}` : ''}`;
  }
}

const transactionService = new TransactionService();
export default transactionService;
