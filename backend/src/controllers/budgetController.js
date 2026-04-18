const Budget = require('../models/Budget');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const analyticsService = require('../services/analyticsService');
const { validateMonth } = require('../utils/validators');

const listBudgets = asyncHandler(async (req, res) => {
  const filters = { user: req.user._id };
  if (req.query.month) {
    filters.month = req.query.month;
  }

  const budgets = await Budget.find(filters).sort({ month: -1, category: 1 }).lean();
  res.json({
    status: 'success',
    data: budgets,
  });
});

const upsertBudget = asyncHandler(async (req, res) => {
  const { month, category = 'overall', amount, alertThreshold = 80 } = req.body;

  if (!validateMonth(month)) {
    throw new AppError('Month must be in YYYY-MM format.', 400);
  }

  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    throw new AppError('Budget amount must be greater than 0.', 400);
  }

  const budget = await Budget.findOneAndUpdate(
    {
      user: req.user._id,
      month,
      category,
    },
    {
      user: req.user._id,
      month,
      category,
      amount: Number(amount),
      alertThreshold: Number(alertThreshold),
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  res.status(201).json({
    status: 'success',
    data: budget,
  });
});

const updateBudget = asyncHandler(async (req, res) => {
  const { amount, alertThreshold } = req.body;
  const budget = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      ...(amount ? { amount: Number(amount) } : {}),
      ...(alertThreshold ? { alertThreshold: Number(alertThreshold) } : {}),
    },
    { new: true, runValidators: true }
  );

  if (!budget) {
    throw new AppError('Budget not found.', 404);
  }

  res.json({
    status: 'success',
    data: budget,
  });
});

const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!budget) {
    throw new AppError('Budget not found.', 404);
  }

  res.json({
    status: 'success',
    message: 'Budget deleted successfully.',
  });
});

const getBudgetSummary = asyncHandler(async (req, res) => {
  const month = req.query.month;
  if (!month || !validateMonth(month)) {
    throw new AppError('Valid month query is required in YYYY-MM format.', 400);
  }

  const summary = await analyticsService.getBudgetProgress(req.user._id, month);
  res.json({
    status: 'success',
    data: summary,
  });
});

module.exports = {
  listBudgets,
  upsertBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
};
