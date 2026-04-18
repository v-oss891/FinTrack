import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/analytics', label: 'Analytics' },
];

const AppLayout = ({ title, subtitle, actions, children }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="brand">
          <div className="brand-mark">FT</div>
          <div className="brand-text">
            <h1>FinTrack</h1>
            <p>Personal Finance Command Center</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              <button type="button" className={`nav-item ${pathname === item.to ? 'active' : ''}`}>
                <span>{item.label}</span>
                <span>{pathname === item.to ? '●' : '○'}</span>
              </button>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-card" style={{ padding: 18, marginBottom: 14 }}>
            <div className="pill" style={{ marginBottom: 12 }}>Signed in</div>
            <div style={{ fontWeight: 700 }}>{user?.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: 6 }}>{user?.email}</div>
          </div>
          <button type="button" className="button-danger" style={{ width: '100%' }} onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>
          <div className="topbar-actions">{actions}</div>
        </div>

        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AppLayout;
