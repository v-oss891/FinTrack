import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/AuthService';

const AuthContext = createContext(null);

/**
 * Provider for authentication state and methods.
 * Now utilizes AuthService (OOP Service Layer).
 */
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
        const userData = await authService.getProfile();
        setUser(userData);
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
    const data = await authService.login(payload);
    localStorage.setItem('fintrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem('fintrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
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
