import { createContext, useState, useEffect } from 'react';
import logger from '../api/logger';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        logger.info({ userId: parsedUser?.id }, 'Session restored');
      }
    } catch (err) {
      localStorage.removeItem('user');
      logger.error({ err }, 'Invalid session cleared');
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    logger.info({ userId: userData.id }, 'Login success');
  };

  const logout = () => {
    logger.info({ userId: user?.id }, 'Logout');
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};