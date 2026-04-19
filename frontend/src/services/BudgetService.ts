import apiService from './ApiService';
import Budget from '../models/Budget';

/**
 * Service for managing budgets and analytics summaries.
 */
class BudgetService {
  public async getBudgets(params: any = {}): Promise<Budget[]> {
    const response = await apiService.get('/budgets', { params });
    return response.data.data.map((b: any) => new Budget(b));
  }

  public async upsertBudget(payload: any): Promise<Budget> {
    const response = await apiService.post('/budgets', payload);
    return new Budget(response.data.data);
  }

  public async updateBudget(id: string, payload: any): Promise<Budget> {
    const response = await apiService.put(`/budgets/${id}`, payload);
    return new Budget(response.data.data);
  }

  public async deleteBudget(id: string): Promise<any> {
    return apiService.delete(`/budgets/${id}`);
  }

  public async getBudgetSummary(month: string): Promise<Budget[]> {
    const response = await apiService.get('/budgets/summary', { params: { month } });
    return response.data.data.map((b: any) => new Budget(b));
  }

  public async getDashboard(month: string): Promise<any> {
    const response = await apiService.get('/users/dashboard', { params: { month } });
    const data = response.data.data;
    return {
      ...data,
      budgetProgress: data.budgetProgress.map((b: any) => new Budget(b)),
      recentTransactions: data.recentTransactions.map((t: any) => ({ ...t, id: t._id })),
    };
  }

  public async getAnalytics(year: number): Promise<any> {
    const response = await apiService.get('/users/analytics', { params: { year } });
    return response.data.data;
  }

  public async getInsights(month: string): Promise<any> {
    const response = await apiService.get('/users/insights', { params: { month } });
    return response.data.data;
  }
}

const budgetService = new BudgetService();
export default budgetService;
