const { Server } = require('socket.io');
const tokenService = require('../services/tokenService');

let io;

exports.init = (server) => {
  io = new Server(server, {
    cors: { 
      origin: "*", 
      methods: ["GET", "POST"] 
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token provided'));

    try {
      const decoded = tokenService.verify(token);
      if (!decoded || !decoded.id) return next(new Error('Invalid token'));
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Auth failed'));
    }
  });

  io.on('connection', (socket) => {
    const room = `user:${socket.userId}`;
    socket.join(room);
    console.log(`SOCKET_SUCCESS: ${socket.id} joined ${room}`);
  });

  return io;
};

exports.emitToUser = (userId, event, data) => {
  if (io && userId) {
    console.log(`SOCKET_EMIT: ${event} to user:${userId}`);
    io.to(`user:${userId}`).emit(event, data);
  }
};
