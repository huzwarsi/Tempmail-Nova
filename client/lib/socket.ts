import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || '';

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Local development
      socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';
    } else {
      // Production: connect directly to backend VPS (not Vercel frontend)
      socketUrl = socketUrl || 'https://api.tempmailnova.com';
    }

    socket = io(socketUrl, {
      autoConnect: true,
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 20000,
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
