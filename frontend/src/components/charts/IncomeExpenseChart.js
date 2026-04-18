import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const IncomeExpenseChart = ({ data }) => (
  <div className="panel">
    <h3 className="panel-title">Income vs Expense</h3>
    <p className="panel-subtitle">Monthly cash flow over the selected year.</p>
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(153, 172, 195, 0.08)" vertical={false} />
          <XAxis dataKey="month" stroke="#99acc3" />
          <YAxis stroke="#99acc3" />
          <Tooltip />
          <Bar dataKey="income" fill="#58f6c7" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expense" fill="#ff6b81" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default IncomeExpenseChart;
