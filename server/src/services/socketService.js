const { Server } = require('socket.io');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => callback(null, true),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join inbox room
    socket.on('join_inbox', (inboxAddress) => {
      if (inboxAddress) {
        const normalized = inboxAddress.toLowerCase().trim();
        socket.join(`inbox:${normalized}`);
        console.log(`[Socket.io] Client ${socket.id} joined room: inbox:${normalized}`);
      }
    });

    // Leave inbox room
    socket.on('leave_inbox', (inboxAddress) => {
      if (inboxAddress) {
        const normalized = inboxAddress.toLowerCase().trim();
        socket.leave(`inbox:${normalized}`);
        console.log(`[Socket.io] Client ${socket.id} left room: inbox:${normalized}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

const emitNewEmail = (inboxAddress, emailData) => {
  if (io) {
    const normalized = inboxAddress.toLowerCase().trim();
    io.to(`inbox:${normalized}`).emit('email_received', emailData);
    // Also emit broadcast stat update to admin listeners
    io.emit('stats_updated', { type: 'new_email' });
  }
};

module.exports = {
  initSocket,
  getIO,
  emitNewEmail,
};
