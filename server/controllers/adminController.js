const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // Run multiple count queries in parallel
        const [usersCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
        const [docsCount] = await pool.execute('SELECT COUNT(*) as count FROM documents');
        const [blogsCount] = await pool.execute('SELECT COUNT(*) as count FROM blogs');
        const [commentsCount] = await pool.execute('SELECT COUNT(*) as count FROM comments');
        const [messagesCount] = await pool.execute('SELECT COUNT(*) as count FROM messages');
        const [loggedTodayCount] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE last_login >= DATE_SUB(NOW(), INTERVAL 1 DAY)');
        
        const stats = {
            totalUsers: usersCount[0].count,
            totalDocuments: docsCount[0].count,
            totalBlogs: blogsCount[0].count,
            totalComments: commentsCount[0].count,
            totalMessages: messagesCount[0].count,
            loggedToday: loggedTodayCount[0].count,
            activeCollaborators: 0,
            socialPostsScheduled: 5,
            aiContentGenerated: 34,
            totalEngagement: '12.4k'
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        // Prevent self-demotion from super_admin if needed, but keeping it simple for now
        let updateQuery = 'UPDATE users SET ';
        const params = [];
        if (role) {
            updateQuery += 'role = ?, ';
            params.push(role);
        }
        if (status) {
            updateQuery += 'status = ?, ';
            params.push(status);
        }
        
        // Remove trailing comma and space
        updateQuery = updateQuery.slice(0, -2);
        updateQuery += ' WHERE id = ?';
        params.push(id);

        await pool.execute(updateQuery, params);

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.execute(`
            SELECT o.*, u.username, u.email, u.full_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.confirmOrder = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;

        // Get order details
        const [orders] = await connection.execute('SELECT * FROM orders WHERE id = ?', [id]);
        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = orders[0];

        // Update order status
        await connection.execute('UPDATE orders SET status = ? WHERE id = ?', ['completed', id]);

        // Upgrade user role based on plan
        let newRole = 'user';
        if (order.plan_name === 'Pro') newRole = 'editor'; // or custom pro role
        if (order.plan_name === 'Team') newRole = 'admin'; // or custom team role

        await connection.execute('UPDATE users SET role = ? WHERE id = ?', [newRole, order.user_id]);

        await connection.commit();
        res.json({ message: 'Order confirmed and user upgraded' });
    } catch (error) {
        await connection.rollback();
        console.error('Error confirming order:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};
