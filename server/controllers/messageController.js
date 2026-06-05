const pool = require('../config/db');

exports.getMessages = async (req, res) => {
    try {
        const { documentId } = req.params;
        const [messages] = await pool.execute(
            `SELECT m.*, u.username 
             FROM messages m 
             JOIN users u ON m.sender_id = u.id 
             WHERE m.document_id = ? 
             ORDER BY m.created_at ASC`,
            [documentId]
        );
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { documentId, content } = req.body;
        const senderId = req.user.id;

        const [result] = await pool.execute(
            'INSERT INTO messages (document_id, sender_id, content) VALUES (?, ?, ?)',
            [documentId, senderId, content]
        );

        res.status(201).json({ id: result.insertId, message: 'Message sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message' });
    }
};
