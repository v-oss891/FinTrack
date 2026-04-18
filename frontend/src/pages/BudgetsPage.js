import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import api from '../api';
import { getMonthValue } from '../utils';

const BudgetsPage = () => {
  const [month, setMonth] = useState(getMonthValue());
  const [budgets, setBudgets] = useState([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadBudgets = useCallback(async () => {
    const [budgetsResponse, summaryResponse] = await Promise.all([
      api.get('/budgets', { params: { month } }),
      api.get('/budgets/summary', { params: { month } }),
    ]);

    const summaryMap = summaryResponse.data.data.reduce((acc, item) => {
      acc[item._id || `${item.month}-${item.category}`] = item;
      return acc;
    }, {});

    setBudgets(
      budgetsResponse.data.data.map((budget) => ({
        ...budget,
        ...(summaryMap[budget._id] || {}),
      }))
    );
  }, [month]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await api.post('/budgets', payload);
      setFeedback('Budget saved successfully.');
      await loadBudgets();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to save budget.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/budgets/${id}`);
    setFeedback('Budget deleted.');
    await loadBudgets();
  };

  return (
    <AppLayout
      title="Budgets"
      subtitle="Set monthly limits, monitor utilization, and keep overspending visible."
      actions={(
        <>
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="button-ghost" />
          <button type="button" className="button" onClick={loadBudgets}>Refresh</button>
        </>
      )}
    >
      <div className="grid">
        {feedback ? <div className="alert warning">{feedback}</div> : null}
        <div className="grid page-grid">
          <BudgetForm onSubmit={handleCreate} saving={saving} />
          <div className="panel">
            <h3 className="panel-title">Budget Utilization</h3>
            <p className="panel-subtitle">All budgets for the selected month with live usage percentages.</p>
            <BudgetList budgets={budgets} onDelete={handleDelete} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BudgetsPage;
