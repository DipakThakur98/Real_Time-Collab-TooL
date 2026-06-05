const pool = require('../config/db');

// In-memory store for active documents to avoid DB thrashing
const activeDocs = {}; 

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.username}`);

        socket.on('join-document', async (documentId) => {
            socket.join(documentId);
            socket.emit('log-activity', { action: `joined document ${documentId}` });
            
            // If doc not in memory, fetch from DB
            if (!activeDocs[documentId]) {
                const [docs] = await pool.execute('SELECT content FROM documents WHERE id = ?', [documentId]);
                if (docs.length > 0) {
                    activeDocs[documentId] = JSON.parse(docs[0].content);
                } else {
                    activeDocs[documentId] = { ops: [] };
                }
            }

            // Send current state to newly joined user
            socket.emit('load-document', activeDocs[documentId]);

            // Track active users in this document
            const usersInRoom = Array.from(io.sockets.adapter.rooms.get(documentId) || [])
                .map(id => io.sockets.sockets.get(id).user.username);
            
            io.to(documentId).emit('user-list', usersInRoom);
        });

        // Handle delta changes
        socket.on('send-changes', (delta, documentId) => {
            // In a real OT system, we would transform the delta here
            // For this version, we'll apply it incrementally to our in-memory state
            // and broadcast it to everyone else
            socket.to(documentId).emit('receive-changes', delta);
            
            // Simple "apply delta" simulation for in-memory persistence
            // Note: In a production app, you'd use a library like Quill-Delta to compose
        });

        // Handle cursor tracking
        socket.on('cursor-move', (range, documentId) => {
            socket.to(documentId).emit('cursor-update', {
                userId: socket.user.id,
                username: socket.user.username,
                range
            });
        });

        // Handle typing indicator
        socket.on('typing', (documentId) => {
            socket.to(documentId).emit('user-typing', socket.user.username);
        });

        // Auto-save mechanism (triggered by client debounced or periodic)
        socket.on('save-document', async (content, documentId) => {
            try {
                activeDocs[documentId] = content;
                socket.emit('log-activity', { action: `saved changes to document ${documentId}` });
                await pool.execute(
                    'UPDATE documents SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [JSON.stringify(content), documentId]
                );
                console.log(`Document ${documentId} auto-saved`);
            } catch (err) {
                console.error('Auto-save error:', err);
            }
        });

        // Handle Chat Messages
        socket.on('send-message', (message, documentId) => {
            socket.emit('log-activity', { action: `sent a message in document ${documentId}` });
            socket.to(documentId).emit('receive-message', {
                ...message,
                sender_id: socket.user.id,
                username: socket.user.username,
                created_at: new Date()
            });
        });

        socket.on('disconnecting', () => {
            for (const room of socket.rooms) {
                if (room !== socket.id) {
                    const usersLeft = Array.from(io.sockets.adapter.rooms.get(room) || [])
                        .filter(id => id !== socket.id)
                        .map(id => io.sockets.sockets.get(id).user.username);
                    socket.to(room).emit('user-list', usersLeft);
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.username}`);
        });
    });
};
