const pool = require('../config/db');

module.exports = (io) => {
    // Keep a simple set of all connected unique user IDs
    const connectedUsers = new Set();
    const adminSockets = new Set();
    const recentActivities = []; // Store last 50 activities

    io.on('connection', (socket) => {
        if (socket.user) {
            connectedUsers.add(socket.user.id);
            // Log joining as an activity
            const namePart = socket.user.full_name 
                ? `${socket.user.full_name} (@${socket.user.username})` 
                : `@${socket.user.username}`;
            const displayName = (socket.user.role === 'admin' || socket.user.role === 'super_admin') 
                ? `Admin: ${namePart}` 
                : namePart;
            addActivity(displayName, 'joined the platform');
            broadcastAdminStats();
        }

        socket.on('join-admin', () => {
            if (socket.user && (socket.user.role === 'admin' || socket.user.role === 'super_admin')) {
                socket.join('admin-room');
                adminSockets.add(socket.id);
                // Call broadcast to send the full, correct stats structure
                broadcastAdminStats();
            }
        });

        // Listen for activity logs from other socket modules
        socket.on('log-activity', (data) => {
            const name = data.name || socket.user.full_name;
            const username = socket.user.username;
            const namePart = name ? `${name} (@${username})` : `@${username}`;
            const displayName = (socket.user.role === 'admin' || socket.user.role === 'super_admin') 
                ? `Admin: ${namePart}` 
                : namePart;
            addActivity(displayName, data.action);
        });

        socket.on('disconnect', () => {
            adminSockets.delete(socket.id);
            
            // Check if the user has any other open sockets before removing them from connectedUsers
            let isUserStillConnected = false;
            for (let [id, s] of io.sockets.sockets) {
                if (s.user && s.user.id === socket.user.id && s.id !== socket.id) {
                    isUserStillConnected = true;
                    break;
                }
            }

            if (!isUserStillConnected && socket.user) {
                connectedUsers.delete(socket.user.id);
                const namePart = socket.user.full_name 
                    ? `${socket.user.full_name} (@${socket.user.username})` 
                    : `@${socket.user.username}`;
                const displayName = (socket.user.role === 'admin' || socket.user.role === 'super_admin') 
                    ? `Admin: ${namePart}` 
                    : namePart;
                addActivity(displayName, 'left the platform');
                broadcastAdminStats();
            }
        });
    });

    function addActivity(username, action) {
        const activity = {
            username,
            action,
            time: 'Just now',
            timestamp: new Date()
        };
        recentActivities.unshift(activity);
        if (recentActivities.length > 50) recentActivities.pop();
        
        io.to('admin-room').emit('new-activity', activity);
    }

    async function broadcastAdminStats() {
        try {
            // Count unique active users by role
            let activeAdmins = 0;
            let activeRegularUsers = 0;
            const seenUserIds = new Set();

            for (let [id, s] of io.sockets.sockets) {
                if (s.user && !seenUserIds.has(s.user.id)) {
                    seenUserIds.add(s.user.id);
                    if (s.user.role === 'admin' || s.user.role === 'super_admin') {
                        activeAdmins++;
                    } else {
                        activeRegularUsers++;
                    }
                }
            }

            // Count logged today by role
            const [loggedTodayAdmins] = await pool.execute(
                "SELECT COUNT(*) as count FROM users WHERE (role = 'admin' OR role = 'super_admin') AND last_login >= DATE_SUB(NOW(), INTERVAL 1 DAY)"
            );
            const [loggedTodayUsers] = await pool.execute(
                "SELECT COUNT(*) as count FROM users WHERE role = 'user' AND last_login >= DATE_SUB(NOW(), INTERVAL 1 DAY)"
            );
            
            io.to('admin-room').emit('admin-stats-update', {
                activeAdmins,
                activeUsers: activeRegularUsers,
                loggedTodayAdmins: loggedTodayAdmins[0].count,
                loggedTodayUsers: loggedTodayUsers[0].count,
                activities: recentActivities
            });
        } catch (error) {
            console.error("Error broadcasting admin stats:", error);
        }
    }
};
