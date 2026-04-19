import Transaction from '../models/Transaction';
import { FilterQuery } from 'mongoose';

/**
 * Repository for Transaction database operations.
 */
class TransactionRepository {
  async find(filters: FilterQuery<any>, sort: any = { date: -1, createdAt: -1 }, skip = 0, limit = 10) {
    return Transaction.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findOne(filters: FilterQuery<any>) {
    return Transaction.findOne(filters).lean();
  }

  async count(filters: FilterQuery<any>) {
    return Transaction.countDocuments(filters);
  }

  async create(data: any) {
    return Transaction.create(data);
  }

  async findOneAndUpdate(filters: FilterQuery<any>, data: any, options = { new: true, runValidators: true }) {
    return Transaction.findOneAndUpdate(filters, data, options);
  }

  async findOneAndDelete(filters: FilterQuery<any>) {
    return Transaction.findOneAndDelete(filters);
  }

  async aggregate(pipeline: any[]) {
    return Transaction.aggregate(pipeline);
  }

  async findAll(filters: FilterQuery<any>, sort: any = { date: -1 }) {
    return Transaction.find(filters).sort(sort).lean();
  }
}

export default new TransactionRepository();
