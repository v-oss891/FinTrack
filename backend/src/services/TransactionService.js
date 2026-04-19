const transactionRepository = require('../repositories/TransactionRepository');
const AppError = require('../utils/AppError');
const { ensureValidTransactionPayload } = require('../utils/validators');

/**
 * Service for managing transaction business logic.
 * Delegating DB operations to TransactionRepository.
 */
class TransactionService {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  buildFilters(userId, query) {
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
  }

  async listTransactions(userId, query) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const filters = this.buildFilters(userId, query);

    const [transactions, total] = await Promise.all([
      this.transactionRepository.find(filters, { date: -1, createdAt: -1 }, (page - 1) * limit, limit),
      this.transactionRepository.count(filters),
    ]);

    return {
      transactions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransaction(userId, transactionId) {
    const transaction = await this.transactionRepository.findOne({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      throw new AppError('Transaction not found.', 404);
    }

    return transaction;
  }

  async createTransaction(userId, transactionData) {
    ensureValidTransactionPayload(transactionData);

    return this.transactionRepository.create({
      user: userId,
      title: transactionData.title.trim(),
      amount: Number(transactionData.amount),
      type: transactionData.type,
      category: transactionData.category,
      paymentMethod: transactionData.paymentMethod || 'bank_transfer',
      notes: transactionData.notes?.trim() || '',
      date: new Date(transactionData.date),
    });
  }

  async updateTransaction(userId, transactionId, transactionData) {
    ensureValidTransactionPayload(transactionData);

    const transaction = await this.transactionRepository.findOneAndUpdate(
      { _id: transactionId, user: userId },
      {
        title: transactionData.title.trim(),
        amount: Number(transactionData.amount),
        type: transactionData.type,
        category: transactionData.category,
        paymentMethod: transactionData.paymentMethod || 'bank_transfer',
        notes: transactionData.notes?.trim() || '',
        date: new Date(transactionData.date),
      }
    );

    if (!transaction) {
      throw new AppError('Transaction not found.', 404);
    }

    return transaction;
  }

  async deleteTransaction(userId, transactionId) {
    const transaction = await this.transactionRepository.findOneAndDelete({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      throw new AppError('Transaction not found.', 404);
    }

    return transaction;
  }

  async getAllForExport(userId, query) {
    const filters = this.buildFilters(userId, query);
    return this.transactionRepository.findAll(filters);
  }
}

module.exports = new TransactionService(transactionRepository);
