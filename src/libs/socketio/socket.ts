import { io } from 'socket.io-client';

// The URL of the server
const BACKEND_URL = import.meta.env.VITE_API_URL;

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === 'production'
    ? BACKEND_URL
    : 'https://be-gloria-production.up.railway.app';

export const socket = io(URL!, {
  transports: ['websocket', 'polling'],
  autoConnect: false
});
