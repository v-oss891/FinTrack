const Budget = require('../models/Budget');

/**
 * Repository for Budget database operations.
 */
class BudgetRepository {
  async find(filters, sort = { month: -1, category: 1 }) {
    return Budget.find(filters).sort(sort).lean();
  }

  async findOne(filters) {
    return Budget.findOne(filters).lean();
  }

  async findOneAndUpdate(filters, data, options = { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }) {
    return Budget.findOneAndUpdate(filters, data, options);
  }

  async findOneAndDelete(filters) {
    return Budget.findOneAndDelete(filters);
  }
}

module.exports = new BudgetRepository();
