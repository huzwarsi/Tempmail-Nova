import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    // In dev environment, target backend port 5000. In production, target '/'
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : '/');

    socket = io(socketUrl, {
      autoConnect: true,
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      timeout: 10000,
    });

    socket.on('connect', () => {
      // Socket connected successfully
    });

    socket.on('connect_error', () => {
      // Handled silently to prevent red console spam when backend is starting or offline
    });
  }
  return socket;
};
