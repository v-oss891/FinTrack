import apiService from './ApiService';
import Budget from '../models/Budget';

/**
 * Service for managing budgets and analytics summaries.
 */
class BudgetService {
  async getBudgets(params = {}) {
    const response = await apiService.get('/budgets', { params });
    return response.data.data.map((b) => new Budget(b));
  }

  async upsertBudget(payload) {
    const response = await apiService.post('/budgets', payload);
    return new Budget(response.data.data);
  }

  async updateBudget(id, payload) {
    const response = await apiService.put(`/budgets/${id}`, payload);
    return new Budget(response.data.data);
  }

  async deleteBudget(id) {
    return apiService.delete(`/budgets/${id}`);
  }

  async getBudgetSummary(month) {
    const response = await apiService.get('/budgets/summary', { params: { month } });
    return response.data.data.map((b) => new Budget(b));
  }

  async getDashboard(month) {
    const response = await apiService.get('/users/dashboard', { params: { month } });
    const data = response.data.data;
    return {
      ...data,
      budgetProgress: data.budgetProgress.map((b) => new Budget(b)),
      recentTransactions: data.recentTransactions.map((t) => ({ ...t, id: t._id })), // keep raw for table or wrap if needed
    };
  }

  async getAnalytics(year) {
    const response = await apiService.get('/users/analytics', { params: { year } });
    return response.data.data;
  }

  async getInsights(month) {
    const response = await apiService.get('/users/insights', { params: { month } });
    return response.data.data;
  }
}

const budgetService = new BudgetService();
export default budgetService;
