import transactionRepository from '../repositories/TransactionRepository';
import AppError from '../utils/AppError';
import { ensureValidTransactionPayload } from '../utils/validators';

/**
 * Service for managing transaction business logic.
 */
class TransactionService {
  private transactionRepository;

  constructor(transactionRepo: any) {
    this.transactionRepository = transactionRepo;
  }

  buildFilters(userId: string, query: any) {
    const filters: any = { user: userId };

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

  async listTransactions(userId: string, query: any) {
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

  async getTransaction(userId: string, transactionId: string) {
    const transaction = await this.transactionRepository.findOne({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      throw new AppError('Transaction not found.', 404);
    }

    return transaction;
  }

  async createTransaction(userId: string, transactionData: any) {
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

  async updateTransaction(userId: string, transactionId: string, transactionData: any) {
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

  async deleteTransaction(userId: string, transactionId: string) {
    const transaction = await this.transactionRepository.findOneAndDelete({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      throw new AppError('Transaction not found.', 404);
    }

    return transaction;
  }

  async getAllForExport(userId: string, query: any) {
    const filters = this.buildFilters(userId, query);
    return this.transactionRepository.findAll(filters);
  }
}

export default new TransactionService(transactionRepository);
