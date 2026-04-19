const mongoose = require('mongoose');
const budgetRepository = require('../repositories/BudgetRepository');
const transactionRepository = require('../repositories/TransactionRepository');
const { getMonthKey, getMonthRange } = require('../utils/date');

/**
 * Service for handling complex analytics and data summaries.
 * Delegating DB operations to BudgetRepository and TransactionRepository.
 */
class AnalyticsService {
  constructor(budgetRepository, transactionRepository) {
    this.budgetRepository = budgetRepository;
    this.transactionRepository = transactionRepository;
  }

  toObjectId(id) {
    return new mongoose.Types.ObjectId(id);
  }

  buildSummary(totals = []) {
    return totals.reduce(
      (acc, item) => {
        acc[item._id] = item.total;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }

  async getBudgetProgress(userId, month) {
    const budgets = await this.budgetRepository.find({ user: userId, month });

    if (!budgets.length) {
      return [];
    }

    const { startDate, endDate } = getMonthRange(month);
    const spending = await this.transactionRepository.aggregate([
      {
        $match: {
          user: this.toObjectId(userId),
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    const spendingMap = spending.reduce((acc, item) => {
      acc[item._id] = item.spent;
      return acc;
    }, {});

    const overallSpent = spending.reduce((sum, item) => sum + item.spent, 0);

    return budgets.map((budget) => {
      const spent = budget.category === 'overall' ? overallSpent : spendingMap[budget.category] || 0;
      const percentage = budget.amount ? Number(((spent / budget.amount) * 100).toFixed(1)) : 0;
      const status = percentage >= 100 ? 'exceeded' : percentage >= budget.alertThreshold ? 'warning' : 'healthy';

      return {
        ...budget,
        spent,
        percentage,
        remaining: Number(Math.max(budget.amount - spent, 0).toFixed(2)),
        status,
      };
    });
  }

  async getDashboard(userId, month = getMonthKey(new Date())) {
    const { startDate, endDate } = getMonthRange(month);

    const [allTimeTotals, monthTotals, recentTransactions, budgetProgress] = await Promise.all([
      this.transactionRepository.aggregate([
        { $match: { user: this.toObjectId(userId) } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
      this.transactionRepository.aggregate([
        {
          $match: {
            user: this.toObjectId(userId),
            date: { $gte: startDate, $lte: endDate },
          },
        },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
      this.transactionRepository.find({ user: userId }, { date: -1, createdAt: -1 }, 0, 6),
      this.getBudgetProgress(userId, month),
    ]);

    const allTime = this.buildSummary(allTimeTotals);
    const monthSummary = this.buildSummary(monthTotals);
    const notifications = budgetProgress
      .filter((item) => item.status !== 'healthy')
      .map((item) => ({
        id: `${item.month}-${item.category}`,
        type: item.status === 'exceeded' ? 'error' : 'warning',
        message:
          item.status === 'exceeded'
            ? `${item.category} budget exceeded for ${item.month}.`
            : `${item.category} budget has reached ${item.percentage}% for ${item.month}.`,
      }));

    return {
      month,
      totalBalance: Number((allTime.income - allTime.expense).toFixed(2)),
      monthIncome: Number(monthSummary.income.toFixed(2)),
      monthExpense: Number(monthSummary.expense.toFixed(2)),
      savings: Number((monthSummary.income - monthSummary.expense).toFixed(2)),
      recentTransactions,
      budgetProgress,
      notifications,
    };
  }

  async getAnalytics(userId, year) {
    const yearStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
    const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const [monthly, categories] = await Promise.all([
      this.transactionRepository.aggregate([
        {
          $match: {
            user: this.toObjectId(userId),
            date: { $gte: yearStart, $lte: yearEnd },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$date' },
              type: '$type',
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]),
      this.transactionRepository.aggregate([
        {
          $match: {
            user: this.toObjectId(userId),
            type: 'expense',
            date: { $gte: yearStart, $lte: yearEnd },
          },
        },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    const monthMap = new Map();
    for (let month = 1; month <= 12; month += 1) {
      monthMap.set(month, { month, income: 0, expense: 0 });
    }

    monthly.forEach((item) => {
      const entry = monthMap.get(item._id.month);
      entry[item._id.type] = Number(item.total.toFixed(2));
    });

    const monthlyReport = Array.from(monthMap.values());
    const totalIncome = monthlyReport.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = monthlyReport.reduce((sum, item) => sum + item.expense, 0);
    const savingsRate = totalIncome > 0 ? Number((((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)) : 0;

    return {
      year,
      summary: {
        totalIncome: Number(totalIncome.toFixed(2)),
        totalExpense: Number(totalExpense.toFixed(2)),
        netSavings: Number((totalIncome - totalExpense).toFixed(2)),
        savingsRate,
      },
      monthlyReport,
      categoryInsights: categories.map((item) => ({
        category: item._id,
        amount: Number(item.total.toFixed(2)),
      })),
    };
  }

  async getInsights(userId, month = getMonthKey(new Date())) {
    const dashboard = await this.getDashboard(userId, month);
    const analytics = await this.getAnalytics(userId, Number(month.split('-')[0]));

    const largestCategory = analytics.categoryInsights[0];
    const insights = [];

    if (dashboard.monthExpense > dashboard.monthIncome) {
      insights.push('Expenses are higher than income this month. Consider reducing discretionary spending.');
    } else if (dashboard.monthIncome > 0) {
      const savingsRate = ((dashboard.monthIncome - dashboard.monthExpense) / dashboard.monthIncome) * 100;
      insights.push(`You are saving ${savingsRate.toFixed(1)}% of your income this month.`);
    }

    if (largestCategory) {
      insights.push(`${largestCategory.category} is your biggest expense category this year.`);
    }

    const exceededBudget = dashboard.budgetProgress.find((item) => item.status === 'exceeded');
    if (exceededBudget) {
      insights.push(`Your ${exceededBudget.category} budget has been exceeded. Tighten spending in that category.`);
    }

    if (!insights.length) {
      insights.push('Your spending looks balanced. Keep monitoring weekly trends and refresh your budgets monthly.');
    }

    return insights;
  }
}

module.exports = new AnalyticsService(budgetRepository, transactionRepository);
