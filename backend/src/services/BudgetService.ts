import budgetRepository from '../repositories/BudgetRepository';
import AppError from '../utils/AppError';
import { validateMonth } from '../utils/validators';

/**
 * Service for managing budget-related business logic.
 */
class BudgetService {
  private budgetRepository;

  constructor(budgetRepo: any) {
    this.budgetRepository = budgetRepo;
  }

  async listBudgets(userId: string, query: any = {}) {
    const filters: any = { user: userId };
    if (query.month) {
      filters.month = query.month;
    }

    return this.budgetRepository.find(filters);
  }

  async upsertBudget(userId: string, budgetData: any) {
    const { month, category = 'overall', amount, alertThreshold = 80 } = budgetData;

    if (!validateMonth(month)) {
      throw new AppError('Month must be in YYYY-MM format.', 400);
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      throw new AppError('Budget amount must be greater than 0.', 400);
    }

    return this.budgetRepository.findOneAndUpdate(
      {
        user: userId,
        month,
        category,
      },
      {
        user: userId,
        month,
        category,
        amount: Number(amount),
        alertThreshold: Number(alertThreshold),
      }
    );
  }

  async updateBudget(userId: string, budgetId: string, updateData: any) {
    const { amount, alertThreshold } = updateData;
    const update: any = {};
    if (amount) update.amount = Number(amount);
    if (alertThreshold) update.alertThreshold = Number(alertThreshold);

    const budget = await this.budgetRepository.findOneAndUpdate(
      { _id: budgetId, user: userId },
      update,
      { new: true, runValidators: true }
    );

    if (!budget) {
      throw new AppError('Budget not found.', 404);
    }

    return budget;
  }

  async deleteBudget(userId: string, budgetId: string) {
    const budget = await this.budgetRepository.findOneAndDelete({
      _id: budgetId,
      user: userId,
    });

    if (!budget) {
      throw new AppError('Budget not found.', 404);
    }

    return budget;
  }
}

export default new BudgetService(budgetRepository);
