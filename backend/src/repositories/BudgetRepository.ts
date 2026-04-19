import Budget from '../models/Budget';
import { FilterQuery } from 'mongoose';

/**
 * Repository for Budget database operations.
 */
class BudgetRepository {
  async find(filters: FilterQuery<any>, sort: any = { month: -1, category: 1 }) {
    return Budget.find(filters).sort(sort).lean();
  }

  async findOne(filters: FilterQuery<any>) {
    return Budget.findOne(filters).lean();
  }

  async findOneAndUpdate(filters: FilterQuery<any>, data: any, options = { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }) {
    return Budget.findOneAndUpdate(filters, data, options);
  }

  async findOneAndDelete(filters: FilterQuery<any>) {
    return Budget.findOneAndDelete(filters);
  }
}

export default new BudgetRepository();
