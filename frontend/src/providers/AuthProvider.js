import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('fintrack_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/me');
        setUser(response.data.data);
      } catch (error) {
        localStorage.removeItem('fintrack_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    localStorage.setItem('fintrack_token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    localStorage.setItem('fintrack_token', response.data.token);
    setToken(response.data.token);
    setUser(response.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Client-side logout should still succeed.
    } finally {
      localStorage.removeItem('fintrack_token');
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
