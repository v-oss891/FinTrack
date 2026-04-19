import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import authService from '../services/AuthService';
import apiService from '../services/ApiService';

const AuthPage = () => {
  const { isAuthenticated, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState({
    checking: true,
    healthy: false,
  });

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await authService.checkHealth();
        setApiStatus({ checking: false, healthy: true });
      } catch (healthError) {
        setApiStatus({ checking: false, healthy: false });
      }
    };

    checkApiStatus();
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      if (mode === 'login') {
        await login({ email: payload.email, password: payload.password });
      } else {
        await register(payload);
      }
    } catch (requestError) {
      setError(apiService.getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-shell">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
      >
        <div className="auth-hero">
          <div className="auth-badge">FinTrack</div>
          <h1>Make your money easier to understand.</h1>
          <p>Track transactions, monthly budgets, analytics, alerts, exports, and insight summaries from a single dashboard.</p>
          <ul className="auth-features">
            <li>JWT-secured authentication and protected routes</li>
            <li>Budget alerts, recent activity, and dashboard analytics</li>
            <li>CSV exports and AI-style spending guidance</li>
          </ul>
        </div>

        <div className="auth-form">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="page-subtitle">Use your account to access your finance workspace.</p>

          <div className={`alert ${apiStatus.healthy ? 'warning' : 'error'}`} style={{ marginBottom: 18 }}>
            {apiStatus.checking
              ? 'Checking backend connection...'
              : apiStatus.healthy
                ? 'Backend connected. You can sign in or create an account.'
                : 'Backend unavailable. Start the API on port 8000 and make sure MongoDB is connected.'}
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            {mode === 'register' ? (
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" placeholder="Alex Carter" required />
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="alex@example.com" required />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" minLength="6" placeholder="Minimum 6 characters" required />
            </div>

            {error ? <div className="alert error">{error}</div> : null}

            <button type="submit" className="button" disabled={saving}>
              {saving ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? 'Need an account?' : 'Already registered?'}{' '}
            <button type="button" className="button-ghost" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
