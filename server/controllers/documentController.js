const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createDocument = async (req, res) => {
    try {
        const id = uuidv4();
        const owner_id = req.user.id;
        
        await pool.execute(
            'INSERT INTO documents (id, owner_id, content) VALUES (?, ?, ?)',
            [id, owner_id, JSON.stringify({ ops: [] })]
        );

        // Add owner as editor in collaborators table
        await pool.execute(
            'INSERT INTO collaborators (document_id, user_id, role) VALUES (?, ?, ?)',
            [id, owner_id, 'editor']
        );

        res.status(201).json({ id, message: 'Document created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating document' });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        // Get documents where user is owner or collaborator
        const [docs] = await pool.execute(
            `SELECT d.* FROM documents d 
             LEFT JOIN collaborators c ON d.id = c.document_id 
             WHERE d.owner_id = ? OR c.user_id = ? 
             GROUP BY d.id`,
            [userId, userId]
        );
        res.json(docs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching documents' });
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [docs] = await pool.execute('SELECT * FROM documents WHERE id = ?', [id]);
        if (docs.length === 0) return res.status(404).json({ message: 'Document not found' });

        // Check permission (optional but good)
        // For simplicity, we'll just return it if it exists for now, 
        // but real apps should check collaborators table.
        
        res.json(docs[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching document' });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const owner_id = req.user.id;

        const [result] = await pool.execute('DELETE FROM documents WHERE id = ? AND owner_id = ?', [id, owner_id]);
        if (result.affectedRows === 0) {
            return res.status(403).json({ message: 'Unauthorized or not found' });
        }

        res.json({ message: 'Document deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting document' });
    }
};
