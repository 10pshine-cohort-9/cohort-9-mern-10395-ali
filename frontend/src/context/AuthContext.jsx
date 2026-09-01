import { createContext, useState, useEffect } from 'react';
import logger from '../api/logger';
import api from '../api/authApi';

export const AuthContext = createContext();

const sanitizeUser = (user) => {
  if (!user || typeof user !== 'object') return null;
  return {
    id: typeof user.id === 'string' ? user.id : '',
    name: typeof user.name === 'string' ? user.name : '',
    email: typeof user.email === 'string' ? user.email : '',
    deleted_notes_count: typeof user.deleted_notes_count === 'number' ? user.deleted_notes_count : 0
  };
};

const sanitizeSession = (data) => {
  const user = sanitizeUser(data && data.user);
  const token = data && typeof data.token === 'string' ? data.token : '';
  return { user, token };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const session = sanitizeSession(JSON.parse(storedUser));
        if (session.token && session.user) {
          api.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
          setUser(session.user);
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
    const session = sanitizeSession(data);
    if (!session.token || !session.user) return;

    try {
      localStorage.setItem('user', JSON.stringify(session));
    } catch (err) {
      logger.error({ err }, 'Failed to persist login session');
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
    setUser(session.user);
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