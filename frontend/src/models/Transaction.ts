export interface TransactionData {
  _id?: string;
  id?: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod?: string;
  notes?: string;
  date: string | Date;
  createdAt?: string | Date;
}

/**
 * Data Model for Transaction.
 */
class Transaction {
  public id?: string;
  public title: string;
  public amount: number;
  public type: 'income' | 'expense';
  public category: string;
  public paymentMethod: string;
  public notes: string;
  public date: Date;
  public createdAt: Date;

  constructor(data: TransactionData) {
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

  get isExpense(): boolean {
    return this.type === 'expense';
  }

  get isIncome(): boolean {
    return this.type === 'income';
  }

  public formatDate(): string {
    return this.date.toLocaleDateString();
  }
}

export default Transaction;
