import React, { useState } from 'react';

const CATEGORIES = [
  'salary', 'freelance', 'food', 'travel', 'bills', 'housing', 
  'shopping', 'health', 'education', 'entertainment', 'transport', 
  'investment', 'insurance', 'tax', 'gift', 'utilities', 'savings', 'other'
];

const TransactionForm = ({ onSubmit, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    paymentMethod: 'bank_transfer',
    notes: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      paymentMethod: 'bank_transfer',
      notes: '',
      date: '',
    });
  };

  return (
    <div className="transaction-form-container">
      <div className="panel">
        <h3 className="panel-title">Add New Transaction</h3>
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Salary, Rent, Groceries..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                required
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
                min="0"
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select 
                id="type"
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select 
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select 
                id="paymentMethod"
                name="paymentMethod" 
                value={formData.paymentMethod} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Optional notes..."
              className="form-textarea"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="button button-secondary" onClick={handleReset}>
              Reset
            </button>
            <button type="button" className="button button-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .transaction-form-container {
          --form-gap: 1.5rem;
          --form-input-height: 44px;
          --form-input-radius: 8px;
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .panel {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
        }

        .panel-title {
          margin: 0 0 2rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--form-gap);
          margin-bottom: var(--form-gap);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: var(--text-secondary);
          font-size: 0.875rem;
          letter-spacing: 0.025em;
        }

        .form-input, .form-select, .form-textarea {
          height: var(--form-input-height);
          padding: 0 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--form-input-radius);
          background: var(--bg-field);
          color: var(--text-primary);
          font-size: 1rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.25rem;
          padding-right: 2.5rem;
          appearance: none;
          cursor: pointer;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
          padding: 1rem;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background: var(--bg-field-hover);
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        .button {
          padding: 0.75rem 1.5rem;
          border-radius: var(--form-input-radius);
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          height: 44px;
        }

        .button-primary {
          background: var(--accent-primary);
          color: white;
        }

        .button-primary:hover:not(:disabled) {
          background: var(--accent-primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow);
        }

        .button-secondary {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .button-secondary:hover:not(:disabled) {
          background: var(--bg-field-hover);
          border-color: var(--border-hover);
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .button {
            justify-content: center;
          }

          .panel {
            padding: 1.5rem;
            margin: 0 -1rem;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;

