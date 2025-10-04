// lib/socket.js
import { io } from 'socket.io-client';

let socket = null;

export function initSocket(userId = null, isAdmin = false) {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:5000', { transports: ['websocket'] });
  }
  if (userId) {
    if (isAdmin) socket.emit('join_admin', userId);
    else socket.emit('join_user', userId);
  }
  return socket;
}

export function getSocket() {
  return socket;
}
