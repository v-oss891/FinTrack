const mongoose = require('mongoose');
const { TRANSACTION_CATEGORIES } = require('../constants/finance');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['overall', ...TRANSACTION_CATEGORIES],
      default: 'overall',
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    alertThreshold: {
      type: Number,
      default: 80,
      min: 1,
      max: 100,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

budgetSchema.index({ user: 1, month: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
