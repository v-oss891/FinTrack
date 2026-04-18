import React from 'react';
import { formatCurrency } from '../utils';

const BudgetList = ({ budgets, onDelete }) => {
  if (!budgets.length) {
    return <div className="empty-state">Create a budget to start receiving spending alerts.</div>;
  }

  return (
    <ul className="budget-list">
      {budgets.map((budget) => (
        <li key={`${budget.month}-${budget.category}`} className="budget-item">
          <div className="budget-meta">
            <div>
              <div style={{ fontWeight: 700 }}>{budget.category}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: 6 }}>{budget.month}</div>
            </div>
            <button type="button" className="button-danger" onClick={() => onDelete(budget._id)}>
              Delete
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span>{formatCurrency(budget.spent || 0)} spent</span>
            <span>{formatCurrency(budget.amount)} budget</span>
          </div>

          <div className={`progress ${budget.status || 'healthy'}`}>
            <span style={{ width: `${Math.min(budget.percentage || 0, 100)}%` }} />
          </div>

          <div style={{ color: 'var(--text-muted)', marginTop: 10 }}>
            {budget.percentage || 0}% used, {formatCurrency(budget.remaining || budget.amount)} remaining
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BudgetList;
