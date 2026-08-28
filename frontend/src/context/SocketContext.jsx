import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem('user');
    const token = stored ? JSON.parse(stored).token : null;

    if (!token) return;

    const newSocket = io('http://localhost:5000', {
      auth: { token },
      reconnection: true
    });

    newSocket.on('connect', () => console.log('Socket Live'));
    newSocket.on('connect_error', (err) => {
      console.error('Socket connect_error:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off();
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};