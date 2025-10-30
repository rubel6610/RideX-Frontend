import { io } from 'socket.io-client';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

export function initSocket(userId = null, isAdmin = false) {
  if (socket?.connected) {
    return socket;
  }

  if (socket && !socket.connected) {
    socket.connect();
    return socket;
  }

  socket = io(process.env.NEXT_PUBLIC_SERVER_BASE_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    timeout: 20000,
    forceNew: false,
  });

  socket.on('connect', () => {
    reconnectAttempts = 0;
    
    if (userId) {
      if (isAdmin) {
        socket.emit('join_admin', userId);
      } else {
        socket.emit('join_user', userId);
      }
    }
  });

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    reconnectAttempts = 0;
  });

  socket.on('reconnect_attempt', () => {
    reconnectAttempts++;
  });

  socket.on('reconnect_error', (error) => {
    console.error('❌ Reconnection error:', error.message);
  });

  socket.on('reconnect_failed', () => {
    console.error('❌ Failed to reconnect after', MAX_RECONNECT_ATTEMPTS, 'attempts');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });

  return socket;
}

export function getSocket() {
  if (!socket) {
    console.warn('⚠️ Socket not initialized. Call initSocket() first.');
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
}