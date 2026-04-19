import apiService from './ApiService';
import Transaction from '../models/Transaction';

/**
 * Service for managing financial transactions.
 */
class TransactionService {
  public async getTransactions(params: any = {}): Promise<{ transactions: Transaction[], meta: any }> {
    const response = await apiService.get('/transactions', { params });
    return {
      transactions: response.data.data.map((t: any) => new Transaction(t)),
      meta: response.data.meta,
    };
  }

  public async getTransaction(id: string): Promise<Transaction> {
    const response = await apiService.get(`/transactions/${id}`);
    return new Transaction(response.data.data);
  }

  public async createTransaction(payload: any): Promise<Transaction> {
    const response = await apiService.post('/transactions', payload);
    return new Transaction(response.data.data);
  }

  public async updateTransaction(id: string, payload: any): Promise<Transaction> {
    const response = await apiService.put(`/transactions/${id}`, payload);
    return new Transaction(response.data.data);
  }

  public async deleteTransaction(id: string): Promise<any> {
    return apiService.delete(`/transactions/${id}`);
  }

  public getExportUrl(params: any = {}): string {
    const query = new URLSearchParams(params).toString();
    return `${apiService.apiBaseUrl}/transactions/export/csv?${query}`;
  }
}

const transactionService = new TransactionService();
export default transactionService;
