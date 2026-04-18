const mongoose = require('mongoose');
const { PAYMENT_METHODS, TRANSACTION_CATEGORIES, TRANSACTION_TYPES } = require('../constants/finance');

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true,
    },
    category: {
      type: String,
      enum: TRANSACTION_CATEGORIES,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'bank_transfer',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

transactionSchema.index({ user: 1, type: 1, category: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
