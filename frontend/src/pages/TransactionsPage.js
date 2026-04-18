import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import TransactionFilters from '../components/TransactionFilters';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import api from '../api';
import { getApiErrorMessage } from '../api';

const emptyFilters = {
  search: '',
  type: '',
  category: '',
  startDate: '',
  endDate: '',
};

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const editingTransactionId = editingTransaction?._id;

  const loadTransactions = useCallback(async () => {
    try {
      const response = await api.get('/transactions', { params: filters });
      setTransactions(response.data.data);
    } catch (error) {
      setFeedback(getApiErrorMessage(error));
      setTransactions([]);
    }
  }, [filters]);

  const handleDelete = useCallback(async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setFeedback('Transaction deleted.');
      if (editingTransactionId === id) {
        setEditingTransaction(null);
      }
      await loadTransactions();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to delete transaction.');
    }
  }, [editingTransactionId, loadTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingTransaction?._id) {
        await api.put(`/transactions/${editingTransaction._id}`, payload);
        setFeedback('Transaction updated successfully.');
      } else {
        await api.post('/transactions', payload);
        setFeedback('Transaction added successfully.');
      }
      setEditingTransaction(null);
      await loadTransactions();
    } catch (error) {
      if (editingTransaction?._id && error.response?.status === 404) {
        setEditingTransaction(null);
        setFeedback('The transaction you were editing no longer exists. The form has been reset.');
      } else {
        setFeedback(error.response?.data?.message || 'Unable to save transaction.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleExport = async () => {
    const response = await api.get('/transactions/export/csv', {
      params: filters,
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions-export.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppLayout
      title="Transactions"
      subtitle="Create, edit, delete, filter, and export all transaction data."
      actions={<button type="button" className="button" onClick={loadTransactions}>Refresh List</button>}
    >
      <div className="grid">
        {feedback ? <div className="alert warning">{feedback}</div> : null}

        <TransactionFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={() => {
            setFilters(emptyFilters);
            setFeedback('');
          }}
          onExport={handleExport}
        />

        <div className="grid page-grid">
          <TransactionForm
            editingTransaction={editingTransaction}
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingTransaction(null);
              setFeedback('');
            }}
            saving={saving}
          />

          <div className="panel">
            <h3 className="panel-title">Transaction History</h3>
            <p className="panel-subtitle">Filtered results appear here in real time.</p>
            <TransactionTable
              transactions={transactions}
              onEdit={(transaction) => {
                setEditingTransaction(transaction);
                setFeedback('');
              }}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default TransactionsPage;
