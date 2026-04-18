const { TRANSACTION_CATEGORIES, TRANSACTION_TYPES, PAYMENT_METHODS } = require('../constants/finance');
const AppError = require('./AppError');

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateMonth = (value) => /^\d{4}-(0[1-9]|1[0-2])$/.test(value);

const ensureValidTransactionPayload = (payload) => {
  const { title, amount, type, category, paymentMethod, date } = payload;

  if (!title || title.trim().length < 2) {
    throw new AppError('Transaction title must be at least 2 characters.', 400);
  }

  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    throw new AppError('Transaction amount must be greater than 0.', 400);
  }

  if (!TRANSACTION_TYPES.includes(type)) {
    throw new AppError(`Transaction type must be one of: ${TRANSACTION_TYPES.join(', ')}`, 400);
  }

  if (!TRANSACTION_CATEGORIES.includes(category)) {
    throw new AppError(`Transaction category must be one of: ${TRANSACTION_CATEGORIES.join(', ')}`, 400);
  }

  if (paymentMethod && !PAYMENT_METHODS.includes(paymentMethod)) {
    throw new AppError(`Payment method must be one of: ${PAYMENT_METHODS.join(', ')}`, 400);
  }

  if (!date || Number.isNaN(new Date(date).getTime())) {
    throw new AppError('Transaction date is invalid.', 400);
  }
};

module.exports = {
  validateEmail,
  validateMonth,
  ensureValidTransactionPayload,
};
