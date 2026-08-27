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
      if (!decoded || !decoded.id) return next(new Error('Auth failed'));
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Auth failed'));
    }
  });

  io.on('connection', (socket) => {
    // FORCE the socket to join the user-specific room
    socket.join(`user:${socket.userId}`);
    logger.info({ userId: socket.userId }, 'User joined private socket room');
  });

  return io;
};

exports.emitToUser = (userId, event, data) => {
  if (io && userId) {
    // This targets only the user with the matching ID
    io.to(`user:${userId}`).emit(event, data);
  }
};