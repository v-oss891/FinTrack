const budgetService = require('../services/BudgetService');
const analyticsService = require('../services/AnalyticsService'); // Note: I will rename/refactor this next
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { validateMonth } = require('../utils/validators');

/**
 * Controller for handling budget requests.
 */
class BudgetController {
  constructor(budgetService, analyticsService) {
    this.budgetService = budgetService;
    this.analyticsService = analyticsService;
  }

  listBudgets = asyncHandler(async (req, res) => {
    const budgets = await this.budgetService.listBudgets(req.user._id, req.query);
    res.json({
      status: 'success',
      data: budgets,
    });
  });

  upsertBudget = asyncHandler(async (req, res) => {
    const budget = await this.budgetService.upsertBudget(req.user._id, req.body);
    res.status(201).json({
      status: 'success',
      data: budget,
    });
  });

  updateBudget = asyncHandler(async (req, res) => {
    const budget = await this.budgetService.updateBudget(req.user._id, req.params.id, req.body);
    res.json({
      status: 'success',
      data: budget,
    });
  });

  deleteBudget = asyncHandler(async (req, res) => {
    await this.budgetService.deleteBudget(req.user._id, req.params.id);
    res.json({
      status: 'success',
      message: 'Budget deleted successfully.',
    });
  });

  getBudgetSummary = asyncHandler(async (req, res) => {
    const month = req.query.month;
    if (!month || !validateMonth(month)) {
      throw new AppError('Valid month query is required in YYYY-MM format.', 400);
    }

    const summary = await this.analyticsService.getBudgetProgress(req.user._id, month);
    res.json({
      status: 'success',
      data: summary,
    });
  });
}

module.exports = new BudgetController(budgetService, analyticsService);
