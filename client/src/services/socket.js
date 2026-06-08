import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

let socket;

export const initiateSocketConnection = (token) => {
	if (!socket) {
		socket = io(SOCKET_URL, {
			auth: { token },
		});
		console.log(`Connecting socket...`);

		socket.on('connect_error', (err) => {
			console.error('Socket connection error:', err.message);
			if (err.message === 'Authentication error') {
				// Clear token/user and force redirect to login since server invalidated token
				sessionStorage.removeItem('token');
				sessionStorage.removeItem('user');
				window.location.href = '/login';
			}
		});
	}
    return socket;
};

export const disconnectSocket = () => {
	console.log('Disconnecting socket...');
	if(socket) {
		socket.disconnect();
		socket = null;
	}
};

export const getSocket = () => socket;
