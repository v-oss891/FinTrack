export interface BudgetData {
  _id?: string;
  id?: string;
  month: string;
  category: string;
  amount: number;
  spent?: number;
  percentage?: number;
  remaining?: number;
  status?: 'healthy' | 'warning' | 'exceeded';
  alertThreshold?: number;
}

/**
 * Data Model for Budget.
 */
class Budget {
  public id?: string;
  public month: string;
  public category: string;
  public amount: number;
  public spent: number;
  public percentage: number;
  public remaining: number;
  public status: 'healthy' | 'warning' | 'exceeded';
  public alertThreshold: number;

  constructor(data: BudgetData) {
    this.id = data._id || data.id;
    this.month = data.month || '';
    this.category = data.category || 'overall';
    this.amount = Number(data.amount) || 0;
    this.spent = Number(data.spent) || 0;
    this.percentage = Number(data.percentage) || 0;
    this.remaining = Number(data.remaining) || 0;
    this.status = data.status || 'healthy';
    this.alertThreshold = data.alertThreshold || 80;
  }

  get isExceeded(): boolean {
    return this.status === 'exceeded';
  }

  get isWarning(): boolean {
    return this.status === 'warning';
  }

  public getFormattedAmount(): string {
    return `$${this.amount.toFixed(2)}`;
  }
}

export default Budget;
