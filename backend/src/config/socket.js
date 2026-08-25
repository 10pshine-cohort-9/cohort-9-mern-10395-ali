const { Server } = require('socket.io');
const tokenService = require('../services/tokenService');
const logger = require('./logger');

let io;

exports.init = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = tokenService.verify(token);
      
      if (!decoded || !decoded.id) {
        return next(new Error('Authentication error: Invalid payload'));
      }

      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
    logger.info({ socketId: socket.id, userId: socket.userId }, 'Socket connected');
    
    socket.on('disconnect', () => {
      logger.info({ socketId: socket.id }, 'Socket disconnected');
    });
  });

  return io;
};

exports.getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

exports.emitToUser = (userId, event, data) => {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, data);
  }
};