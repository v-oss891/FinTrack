import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const colors = ['#58f6c7', '#5a88ff', '#ff6b81', '#ffb347', '#7efcff', '#9a7cff', '#6df0ff'];

const CategoryPieChart = ({ data }) => (
  <div className="panel">
    <h3 className="panel-title">Category Insights</h3>
    <p className="panel-subtitle">Where most of your spending is going.</p>
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="amount" nameKey="category" innerRadius={72} outerRadius={110}>
            {data.map((item, index) => (
              <Cell key={item.category} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default CategoryPieChart;
