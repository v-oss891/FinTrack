import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';
import budgetService from '../services/BudgetService';
import { getMonthValue } from '../utils';

const BudgetsPage = () => {
  const [month, setMonth] = useState(getMonthValue());
  const [budgets, setBudgets] = useState([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadBudgets = useCallback(async () => {
    try {
      const [budgetsData, summaryData] = await Promise.all([
        budgetService.getBudgets({ month }),
        budgetService.getBudgetSummary(month),
      ]);

      const summaryMap = summaryData.reduce((acc, item) => {
        acc[item._id || `${item.month}-${item.category}`] = item;
        return acc;
      }, {});

      setBudgets(
        budgetsData.map((budget) => ({
          ...budget,
          ...(summaryMap[budget._id] || {}),
        }))
      );
    } catch (error) {
      setFeedback('Unable to load budgets.');
    }
  }, [month]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await budgetService.upsertBudget(payload);
      setFeedback('Budget saved successfully.');
      await loadBudgets();
    } catch (error) {
      setFeedback('Unable to save budget.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await budgetService.deleteBudget(id);
      setFeedback('Budget deleted.');
      await loadBudgets();
    } catch (error) {
      setFeedback('Unable to delete budget.');
    }
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
        {feedback ? <div className={`alert ${feedback.includes('success') || feedback.includes('deleted') ? 'success' : 'warning'}`}>{feedback}</div> : null}
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
