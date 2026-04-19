/**
 * Data Model for Budget.
 */
class Budget {
  constructor(data = {}) {
    this.id = data._id || data.id;
    this.month = data.month || '';
    this.category = data.category || 'overall';
    this.amount = Number(data.amount) || 0;
    this.alertThreshold = Number(data.alertThreshold) || 80;
    
    // Summary fields (optional)
    this.spent = Number(data.spent) || 0;
    this.percentage = Number(data.percentage) || 0;
    this.status = data.status || 'healthy';
    this.remaining = Number(data.remaining) || 0;
  }

  get isExceeded() {
    return this.percentage >= 100;
  }

  get hasWarning() {
    return this.percentage >= this.alertThreshold && this.percentage < 100;
  }
}

export default Budget;
