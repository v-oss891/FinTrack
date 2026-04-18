import React from 'react';
import { formatCurrency, formatDate } from '../utils';

const TransactionTable = ({ transactions, onDelete }) => {
  if (!transactions.length) {
    return <div className="empty-state">No transactions found for the selected filters.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Category</th>
            <th>Method</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>
                <div style={{ fontWeight: 600 }}>{transaction.title}</div>
                {transaction.notes ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 6 }}>{transaction.notes}</div>
                ) : null}
              </td>
              <td>{formatDate(transaction.date)}</td>
              <td><span className="pill">{transaction.category}</span></td>
              <td>{transaction.paymentMethod}</td>
              <td>{transaction.type}</td>
              <td className={`amount ${transaction.type}`}>{formatCurrency(transaction.amount)}</td>
              <td>
                <button type="button" className="button-danger" onClick={() => onDelete(transaction._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;

