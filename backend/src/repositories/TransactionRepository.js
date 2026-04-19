const Transaction = require('../models/Transaction');

/**
 * Repository for Transaction database operations.
 */
class TransactionRepository {
  async find(filters, sort = { date: -1, createdAt: -1 }, skip = 0, limit = 10) {
    return Transaction.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findOne(filters) {
    return Transaction.findOne(filters).lean();
  }

  async count(filters) {
    return Transaction.countDocuments(filters);
  }

  async create(data) {
    return Transaction.create(data);
  }

  async findOneAndUpdate(filters, data, options = { new: true, runValidators: true }) {
    return Transaction.findOneAndUpdate(filters, data, options);
  }

  async findOneAndDelete(filters) {
    return Transaction.findOneAndDelete(filters);
  }

  async aggregate(pipeline) {
    return Transaction.aggregate(pipeline);
  }

  async findAll(filters, sort = { date: -1 }) {
    return Transaction.find(filters).sort(sort).lean();
  }
}

module.exports = new TransactionRepository();
