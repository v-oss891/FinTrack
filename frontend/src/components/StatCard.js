import React from 'react';
import { formatCurrency } from '../utils';

const StatCard = ({ label, value, tone, helper }) => (
  <div className="panel stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={{ color: tone || 'var(--text)' }}>
      {formatCurrency(value)}
    </div>
    {helper ? <div style={{ color: 'var(--text-muted)', marginTop: 10 }}>{helper}</div> : null}
    <div className="stat-accent" />
  </div>
);

export default StatCard;
