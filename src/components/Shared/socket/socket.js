import { io } from 'socket.io-client';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

export function initSocket(userId = null, isAdmin = false) {
  console.log('initSocket called with userId:', userId, 'isAdmin:', isAdmin);
  if (socket?.connected) {
    console.log('Returning existing connected socket');
    return socket;
  }

  if (socket && !socket.connected) {
    console.log('Connecting existing socket');
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
  
  console.log('Socket created with options:', {
    url: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    userId: userId,
    isAdmin: isAdmin
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    reconnectAttempts = 0;
    
    if (userId) {
      if (isAdmin) {
        socket.emit('join_admin', userId);
        console.log('👨‍💼 Admin joined admins room with userId:', userId);
      } else {
        socket.emit('join_user', userId);
        console.log('👤 User joined user room with userId:', userId);
        console.log('User room name:', `user_${userId}`);
      }
    } else {
      console.log('No userId provided, not joining any room');
    }
  });

  socket.on('disconnect', (reason) => {
    console.warn('⚠️ Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    reconnectAttempts = 0;
  });

  socket.on('reconnect_attempt', () => {
    reconnectAttempts++;
    console.log(`🔄 Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
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
    console.log('🔌 Socket disconnected and cleared');
  }
}