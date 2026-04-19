import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import authService from '../services/AuthService';

interface AuthContextType {
  token: string | null;
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provider for authentication state and methods.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('fintrack_token'));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(token));

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

  const login = async (payload: any) => {
    const data = await authService.login(payload);
    localStorage.setItem('fintrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (payload: any) => {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
