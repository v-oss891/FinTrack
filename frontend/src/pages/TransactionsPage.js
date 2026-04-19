import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import TransactionFilters from '../components/TransactionFilters';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import transactionService from '../services/TransactionService';
import apiService from '../services/ApiService';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const editingTransactionId = editingTransaction?._id;

  const loadTransactions = useCallback(async () => {
    try {
      const data = await transactionService.getTransactions(filters);
      setTransactions(data.data);
    } catch (error) {
      setFeedback(apiService.getErrorMessage(error));
      setTransactions([]);
    }
  }, [filters]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (!editId || !transactions.length) return;
    const target = transactions.find((t) => (t._id || t.id) === editId);
    if (target) {
      setEditingTransaction(target);
      setFeedback('Editing transaction from dashboard.');
      searchParams.delete('edit');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, transactions, setSearchParams]);

  const handleDelete = useCallback(async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setFeedback('Transaction deleted.');
      if (editingTransactionId === id) {
        setEditingTransaction(null);
      }
      await loadTransactions();
    } catch (error) {
      setFeedback('Unable to delete transaction.');
    }
  }, [editingTransactionId, loadTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingTransaction?._id) {
        await transactionService.updateTransaction(editingTransaction._id, payload);
        setFeedback('Transaction updated successfully.');
      } else {
        await transactionService.createTransaction(payload);
        setFeedback('Transaction added successfully.');
      }
      setEditingTransaction(null);
      await loadTransactions();
    } catch (error) {
      if (editingTransaction?._id && error.response?.status === 404) {
        setEditingTransaction(null);
        setFeedback('The transaction you were editing no longer exists. The form has been reset.');
      } else {
        setFeedback(apiService.getErrorMessage(error));
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
    try {
      // Use raw fetch or blob for download
      const response = await apiService.get('/transactions/export/csv', {
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
    } catch (error) {
      setFeedback('Unable to export transactions.');
    }
  };

  return (
    <AppLayout
      title="Transactions"
      subtitle="Create, edit, delete, filter, and export all transaction data."
      actions={<button type="button" className="button" onClick={loadTransactions}>Refresh List</button>}
    >
      <div className="grid">
        {feedback ? <div className={`alert ${feedback.includes('success') || feedback.includes('deleted') ? 'success' : 'warning'}`}>{feedback}</div> : null}

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
