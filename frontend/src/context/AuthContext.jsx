import { createContext, useState, useEffect } from 'react';
import logger from '../api/logger';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          logger.info({ userId: parsedUser.id }, 'Session restored');
        }
      } catch (err) {
        localStorage.removeItem('user');
        logger.error({ err }, 'Session restoration failed');
      }
    }
    setLoading(false);
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