const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMessages, sendMessage } = require('../controllers/messageController');

router.use(auth);

router.get('/:documentId', getMessages);
router.post('/', sendMessage);

module.exports = router;
