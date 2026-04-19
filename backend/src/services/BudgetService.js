const budgetRepository = require('../repositories/BudgetRepository');
const AppError = require('../utils/AppError');
const { validateMonth } = require('../utils/validators');

/**
 * Service for managing budget-related business logic.
 * Delegating DB operations to BudgetRepository.
 */
class BudgetService {
  constructor(budgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  async listBudgets(userId, query = {}) {
    const filters = { user: userId };
    if (query.month) {
      filters.month = query.month;
    }

    return this.budgetRepository.find(filters);
  }

  async upsertBudget(userId, budgetData) {
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

  async updateBudget(userId, budgetId, updateData) {
    const { amount, alertThreshold } = updateData;
    const update = {};
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

  async deleteBudget(userId, budgetId) {
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

module.exports = new BudgetService(budgetRepository);
