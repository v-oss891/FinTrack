import React, { useState } from 'react';
import { transactionCategories } from '../constants';
import { getMonthValue } from '../utils';

const BudgetForm = ({ onSubmit, saving }) => {
  const [form, setForm] = useState({
    month: getMonthValue(),
    category: 'overall',
    amount: '',
    alertThreshold: 80,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
      alertThreshold: Number(form.alertThreshold),
    });
  };

  return (
    <div className="panel">
      <h3 className="panel-title">Set Monthly Budget</h3>
      <p className="panel-subtitle">Define overall or category-specific limits and receive alerts.</p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="month">Month</label>
          <input id="month" name="month" type="month" value={form.month} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            <option value="overall">overall</option>
            {transactionCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="amount">Budget Amount</label>
          <input id="amount" name="amount" type="number" min="1" step="0.01" value={form.amount} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="alertThreshold">Alert Threshold (%)</label>
          <input id="alertThreshold" name="alertThreshold" type="number" min="1" max="100" value={form.alertThreshold} onChange={handleChange} />
        </div>
        <button type="submit" className="button" disabled={saving}>
          {saving ? 'Saving...' : 'Save budget'}
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;
