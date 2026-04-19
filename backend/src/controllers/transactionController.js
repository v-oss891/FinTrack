const transactionService = require('../services/TransactionService');
const asyncHandler = require('../utils/asyncHandler');
const { toCsv } = require('../utils/csv');

/**
 * Controller for handling transaction requests.
 */
class TransactionController {
  constructor(transactionService) {
    this.transactionService = transactionService;
  }

  listTransactions = asyncHandler(async (req, res) => {
    const { transactions, meta } = await this.transactionService.listTransactions(req.user._id, req.query);
    res.json({
      status: 'success',
      data: transactions,
      meta,
    });
  });

  getTransaction = asyncHandler(async (req, res) => {
    const transaction = await this.transactionService.getTransaction(req.user._id, req.params.id);
    res.json({
      status: 'success',
      data: transaction,
    });
  });

  createTransaction = asyncHandler(async (req, res) => {
    const transaction = await this.transactionService.createTransaction(req.user._id, req.body);
    res.status(201).json({
      status: 'success',
      data: transaction,
    });
  });

  updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await this.transactionService.updateTransaction(req.user._id, req.params.id, req.body);
    res.json({
      status: 'success',
      data: transaction,
    });
  });

  deleteTransaction = asyncHandler(async (req, res) => {
    await this.transactionService.deleteTransaction(req.user._id, req.params.id);
    res.json({
      status: 'success',
      message: 'Transaction deleted successfully.',
    });
  });

  exportTransactionsCsv = asyncHandler(async (req, res) => {
    const transactions = await this.transactionService.getAllForExport(req.user._id, req.query);

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
}

module.exports = new TransactionController(transactionService);
