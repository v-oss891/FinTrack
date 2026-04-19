import React, { useCallback, useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import StatCard from '../components/StatCard';
import budgetService from '../services/BudgetService';

const AnalyticsPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [analytics, setAnalytics] = useState(null);

  const loadAnalytics = useCallback(async () => {
    try {
      const data = await budgetService.getAnalytics(year);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics', error);
    }
  }, [year]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return (
    <AppLayout
      title="Analytics"
      subtitle="Understand yearly performance, spending distribution, and savings patterns."
      actions={(
        <>
          <input type="number" value={year} onChange={(event) => setYear(event.target.value)} className="button-ghost" />
          <button type="button" className="button" onClick={loadAnalytics}>Refresh</button>
        </>
      )}
    >
      {!analytics ? (
        <div className="loading-screen">Loading analytics...</div>
      ) : (
        <div className="grid">
          <div className="grid stats-grid">
            <StatCard label="Yearly Income" value={analytics.summary.totalIncome} tone="var(--primary)" />
            <StatCard label="Yearly Expense" value={analytics.summary.totalExpense} tone="var(--danger)" />
            <StatCard label="Net Savings" value={analytics.summary.netSavings} tone="#7efcff" />
            <div className="panel stat-card">
              <div className="stat-label">Savings Rate</div>
              <div className="stat-value">{analytics.summary.savingsRate}%</div>
            </div>
          </div>

          <div className="grid charts-grid">
            <IncomeExpenseChart
              data={analytics.monthlyReport.map((item) => ({
                ...item,
                month: item.month.toString().padStart(2, '0'),
              }))}
            />
            <CategoryPieChart data={analytics.categoryInsights} />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AnalyticsPage;
