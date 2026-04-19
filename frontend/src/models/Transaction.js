/**
 * Data Model for Transaction.
 * Ensures consistent structure and helper methods for transactions.
 */
class Transaction {
  constructor(data = {}) {
    this.id = data._id || data.id;
    this.title = data.title || '';
    this.amount = Number(data.amount) || 0;
    this.type = data.type || 'expense';
    this.category = data.category || 'other';
    this.paymentMethod = data.paymentMethod || 'bank_transfer';
    this.notes = data.notes || '';
    this.date = data.date ? new Date(data.date) : new Date();
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  get isExpense() {
    return this.type === 'expense';
  }

  get isIncome() {
    return this.type === 'income';
  }

  formatDate() {
    return this.date.toLocaleDateString();
  }
}

export default Transaction;
