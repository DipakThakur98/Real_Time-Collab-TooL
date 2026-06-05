const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// All notification routes require authentication
router.use(authMiddleware);

// Get all notifications
router.get('/', notificationController.getNotifications);

// Mark a specific notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Create a new notification (Admin only)
router.post('/', notificationController.createNotification);

module.exports = router;
