const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createDocument, getDocuments, getDocumentById, deleteDocument } = require('../controllers/documentController');

router.use(auth); // Protect all document routes

router.post('/', createDocument);
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);

module.exports = router;
