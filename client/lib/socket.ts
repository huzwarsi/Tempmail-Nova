import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    // In dev environment, target backend port 5000. In production, target '/'
    let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || '';
    if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';
      } else if (!socketUrl || socketUrl === '/' || socketUrl.startsWith('/')) {
        socketUrl = 'https://api.tempmailnova.com';
      }
    }
    if (!socketUrl) {
      socketUrl = 'https://api.tempmailnova.com';
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
