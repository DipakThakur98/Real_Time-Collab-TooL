const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/accounts/connect', socialController.connectAccount);
router.delete('/accounts/:platform', socialController.disconnectAccount);
router.put('/accounts/:platform', socialController.updateAccount);
router.get('/accounts', socialController.getAccounts);
router.post('/posts/schedule', socialController.createSocialPost);
router.get('/posts/history', socialController.getPostHistory);
router.post('/ai/generate-caption', socialController.generateAICaption);

module.exports = router;
