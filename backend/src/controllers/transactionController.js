const Transaction = require('../models/Transaction');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { toCsv } = require('../utils/csv');
const { ensureValidTransactionPayload } = require('../utils/validators');

const buildFilters = (userId, query) => {
  const filters = { user: userId };

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filters.date = {};
    if (query.startDate) {
      filters.date.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      filters.date.$lte = new Date(query.endDate);
    }
  }

  if (query.search) {
    filters.title = { $regex: query.search, $options: 'i' };
  }

  return filters;
};

const listTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const filters = buildFilters(req.user._id, req.query);

  const [transactions, total] = await Promise.all([
    Transaction.find(filters)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(filters),
  ]);

  res.json({
    status: 'success',
    data: transactions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).lean();

  if (!transaction) {
    throw new AppError('Transaction not found.', 404);
  }

  res.json({
    status: 'success',
    data: transaction,
  });
});

const createTransaction = asyncHandler(async (req, res) => {
  ensureValidTransactionPayload(req.body);

  const transaction = await Transaction.create({
    user: req.user._id,
    title: req.body.title.trim(),
    amount: Number(req.body.amount),
    type: req.body.type,
    category: req.body.category,
    paymentMethod: req.body.paymentMethod || 'bank_transfer',
    notes: req.body.notes?.trim() || '',
    date: new Date(req.body.date),
  });

  res.status(201).json({
    status: 'success',
    data: transaction,
  });
});

const updateTransaction = asyncHandler(async (req, res) => {
  ensureValidTransactionPayload(req.body);

  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      title: req.body.title.trim(),
      amount: Number(req.body.amount),
      type: req.body.type,
      category: req.body.category,
      paymentMethod: req.body.paymentMethod || 'bank_transfer',
      notes: req.body.notes?.trim() || '',
      date: new Date(req.body.date),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!transaction) {
    throw new AppError('Transaction not found.', 404);
  }

  res.json({
    status: 'success',
    data: transaction,
  });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw new AppError('Transaction not found.', 404);
  }

  res.json({
    status: 'success',
    message: 'Transaction deleted successfully.',
  });
});

const exportTransactionsCsv = asyncHandler(async (req, res) => {
  const filters = buildFilters(req.user._id, req.query);
  const transactions = await Transaction.find(filters).sort({ date: -1 }).lean();

  const csv = toCsv(
    transactions.map((item) => ({
      title: item.title,
      amount: item.amount,
      type: item.type,
      category: item.category,
      date: item.date.toISOString(),
      paymentMethod: item.paymentMethod,
      notes: item.notes,
    }))
  );

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transactions-export.csv"');
  res.status(200).send(csv);
});

module.exports = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  exportTransactionsCsv,
};
