import { createContext, useState, useEffect } from 'react';
import logger from '../api/logger';
import api from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const data = JSON.parse(storedUser);
        if (data && data.token && data.user) {
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          setUser(data.user);
          logger.info('Session restored from storage');
        }
      }
    } catch (err) {
      try {
        localStorage.removeItem('user');
      } catch (storageErr) {}
      logger.error({ err }, 'Auth restoration failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = (data) => {
    try {
      const session = { user: data.user, token: data.token };
      localStorage.setItem('user', JSON.stringify(session));
    } catch (err) {
      logger.error({ err }, 'Failed to persist login session');
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    logger.info('Login session active');
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
    } catch (err) {
      logger.error({ err }, 'Failed to remove session from storage');
    }
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    logger.info('Session cleared');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};