import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import TransactionTable from '../components/TransactionTable';
import api from '../api';
import { formatCurrency, getMonthValue } from '../utils';

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [month, setMonth] = useState(getMonthValue());
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const loadDashboard = useCallback(async () => {
    const [dashboardResponse, insightsResponse] = await Promise.all([
      api.get('/users/dashboard', { params: { month } }),
      api.get('/users/insights', { params: { month } }),
    ]);

    setDashboard({
      ...dashboardResponse.data.data,
      insights: insightsResponse.data.data,
    });
  }, [month]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      setFeedback('Transaction deleted.');
      await loadDashboard();
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to delete transaction.');
    }
  };

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Balance overview, recent activity, alerts, and actionable insights."
      actions={(
        <>
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="button-ghost" />
          <button type="button" className="button" onClick={loadDashboard}>Refresh</button>
        </>
      )}
    >
      {!dashboard ? (
        <div className="loading-screen">Loading dashboard data...</div>
      ) : (
        <div className="grid">
          {feedback ? <div className="alert warning">{feedback}</div> : null}
          <div className="grid stats-grid">
            <StatCard label="Total Balance" value={dashboard.totalBalance} tone="var(--primary)" />
            <StatCard label="Month Income" value={dashboard.monthIncome} tone="#89ffd4" />
            <StatCard label="Month Expense" value={dashboard.monthExpense} tone="var(--danger)" />
            <StatCard label="Savings" value={dashboard.savings} tone="#7efcff" />
          </div>

          <div className="grid charts-grid">
            <div className="panel">
              <h3 className="panel-title">Budget Alerts</h3>
              <p className="panel-subtitle">Warnings appear automatically as budgets fill up.</p>
{dashboard.notifications?.length ? (
                dashboard.notifications.map((item) => (
                  <div key={item.id} className={`alert ${item.type}`}>
                    {item.message}
                  </div>
                ))
              ) : (
                <div className="empty-state">No budget alerts for this month.</div>
              )}
            </div>

            <div className="panel">
              <h3 className="panel-title">AI Spending Insights</h3>
              <p className="panel-subtitle">Rule-based suggestions derived from your trends.</p>
              <ul className="insight-list">
{dashboard.insights?.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid charts-grid">
            <div className="panel">
              <h3 className="panel-title">Budget Progress</h3>
              <p className="panel-subtitle">Track every limit against actual spending.</p>
{dashboard.budgetProgress?.length ? (
                <ul className="budget-list">
                  {dashboard.budgetProgress.map((budget) => (
                    <li key={`${budget.month}-${budget.category}`} className="budget-item">
                      <div className="budget-meta">
                        <strong>{budget.category}</strong>
                        <span>{formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}</span>
                      </div>
                      <div className={`progress ${budget.status}`}>
                        <span style={{ width: `${Math.min(budget.percentage, 100)}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  No budgets yet. <Link to="/budgets" style={{ color: 'var(--primary)' }}>Create your first budget.</Link>
                </div>
              )}
            </div>

            <div className="panel">
              <h3 className="panel-title">Recent Transactions</h3>
              <p className="panel-subtitle">Your six most recent financial events.</p>
                <TransactionTable
                transactions={dashboard.recentTransactions}
                onEdit={(transaction) => {
                  navigate(`/transactions?edit=${transaction._id || transaction.id}`);
                }}

                onDelete={handleDelete}

              />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
