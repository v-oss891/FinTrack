import React from 'react';
import { transactionCategories } from '../constants';

const TransactionFilters = ({ filters, onChange, onReset, onExport }) => (
  <div className="filters">
    <div className="filters-grid">
      <div className="field">
        <label htmlFor="search">Search</label>
        <input id="search" name="search" value={filters.search} onChange={onChange} placeholder="Search title" />
      </div>
      <div className="field">
        <label htmlFor="type">Type</label>
        <select id="type" name="type" value={filters.type} onChange={onChange}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={filters.category} onChange={onChange}>
          <option value="">All</option>
          {transactionCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="startDate">Start</label>
        <input id="startDate" name="startDate" type="date" value={filters.startDate} onChange={onChange} />
      </div>
      <div className="field">
        <label htmlFor="endDate">End</label>
        <input id="endDate" name="endDate" type="date" value={filters.endDate} onChange={onChange} />
      </div>
    </div>

    <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
      <button type="button" className="button-ghost" onClick={onReset}>Reset filters</button>
      <button type="button" className="button-secondary" onClick={onExport}>Export CSV</button>
    </div>
  </div>
);

export default TransactionFilters;
