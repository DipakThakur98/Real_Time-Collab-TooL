const pool = require('../config/db');

// Get all notifications for the current user
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Fetch user specific and global notifications
        const [notifications] = await pool.query(
            `SELECT * FROM notifications 
             WHERE user_id = ? OR user_id IS NULL 
             ORDER BY created_at DESC LIMIT 50`,
            [userId]
        );
        
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};

// Mark a specific notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Ensure the notification belongs to the user or is global
        await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
            [id, userId]
        );
        
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Failed to mark notification as read' });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await pool.query(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ? OR user_id IS NULL',
            [userId]
        );
        
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Failed to mark all notifications as read' });
    }
};

// Create a new notification (Admin only or Internal System)
exports.createNotification = async (req, res) => {
    try {
        const { userId, title, message, type } = req.body;
        
        // Ensure requester is admin
        if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const [result] = await pool.query(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [userId || null, title, message, type || 'info']
        );
        
        const newNotification = {
            id: result.insertId,
            user_id: userId || null,
            title,
            message,
            type: type || 'info',
            is_read: 0,
            created_at: new Date()
        };

        // Emit socket event to clients
        if (req.io) {
            if (userId) {
                // To specific user if user-specific rooms are implemented
                req.io.emit(`notification-${userId}`, newNotification);
            } else {
                // To all users
                req.io.emit('global-notification', newNotification);
            }
        }
        
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Failed to create notification' });
    }
};
