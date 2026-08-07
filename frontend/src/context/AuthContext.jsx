import { createContext, useState, useEffect } from 'react';
import logger from '../api/logger';
import api from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const data = JSON.parse(storedUser);
        if (data && data.token && data.user) {
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          setUser(data.user);
          logger.info({ userId: data.user.id }, 'Session restored');
        }
      } catch (err) {
        localStorage.removeItem('user');
        logger.error({ err }, 'Auth restoration failed');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (data) => {
    const session = { user: data.user, token: data.token };
    localStorage.setItem('user', JSON.stringify(session));
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    logger.info({ userId: data.user.id }, 'Login session saved');
  };

  const logout = () => {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('user');
    setUser(null);
    logger.info('Session cleared');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};