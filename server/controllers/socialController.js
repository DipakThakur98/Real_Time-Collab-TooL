const db = require('../config/db');

// Connect a social account (Simulated OAuth)
exports.connectAccount = async (req, res) => {
    try {
        const { platform, profile_name, token } = req.body;
        const user_id = req.user.id;

        const query = `
            INSERT INTO social_accounts (user_id, platform, profile_name, access_token)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE profile_name = VALUES(profile_name), access_token = VALUES(access_token)
        `;
        await db.query(query, [user_id, platform, profile_name, token]);
        res.status(201).json({ message: `${platform} account connected` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Disconnect a social account
exports.disconnectAccount = async (req, res) => {
    try {
        const { platform } = req.params;
        const user_id = req.user.id;
        await db.query("DELETE FROM social_accounts WHERE user_id = ? AND platform = ?", [user_id, platform]);
        res.json({ message: `${platform} account disconnected` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a social account
exports.updateAccount = async (req, res) => {
    try {
        const { platform } = req.params;
        const { profile_name } = req.body;
        const user_id = req.user.id;

        const query = "UPDATE social_accounts SET profile_name = ? WHERE user_id = ? AND platform = ?";
        const [result] = await db.query(query, [profile_name, user_id, platform]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        
        res.json({ message: `${platform} account updated` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get connected accounts
exports.getAccounts = async (req, res) => {
    try {
        const query = "SELECT id, platform, profile_name, connected_at FROM social_accounts WHERE user_id = ?";
        const [results] = await db.query(query, [req.user.id]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Schedule/Create a social post
exports.createSocialPost = async (req, res) => {
    try {
        const { blog_id, platform, caption, scheduled_at, image_url } = req.body;
        const query = "INSERT INTO social_posts (blog_id, platform, caption, scheduled_at, image_url, status) VALUES (?, ?, ?, ?, ?, 'scheduled')";
        const [result] = await db.query(query, [blog_id, platform, caption, scheduled_at, image_url]);
        res.status(201).json({ id: result.insertId, message: 'Social post scheduled' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Auto-post to all connected platforms when a blog is published
exports.autoPostBlog = async (blog_id, title, author_id) => {
    try {
        const [accounts] = await db.query(
            "SELECT platform, profile_name FROM social_accounts WHERE user_id = ?", [author_id]
        );

        const captions = {
            instagram: `📸 New blog published! "${title}" — Real-time collaboration made smarter. Read it now! 🔗 #CollabTool #AI #Tech`,
            facebook: `🗞️ New Article Alert! We just published: "${title}". Check it out on our blog for the full deep dive. #CollabTool`,
            linkedin: `🚀 Excited to share our latest article: "${title}". Dive into how real-time collaboration is evolving. #CollabTool #TechInnovation #AI`,
        };

        const postPromises = accounts.map(acc =>
            db.query(
                "INSERT INTO social_posts (blog_id, platform, caption, status) VALUES (?, ?, ?, 'published')",
                [blog_id, acc.platform, captions[acc.platform] || `New post: ${title}`]
            )
        );
        await Promise.all(postPromises);
        return accounts.length;
    } catch (err) {
        console.error('Auto-post error:', err.message);
        return 0;
    }
};

// Get post history/analytics
exports.getPostHistory = async (req, res) => {
    try {
        const query = `
            SELECT sp.*, b.title as blog_title 
            FROM social_posts sp
            LEFT JOIN blogs b ON sp.blog_id = b.id
            ORDER BY sp.id DESC
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// AI Caption Generator
exports.generateAICaption = (req, res) => {
    const { blogTitle, platform } = req.body;
    let caption = "";
    if (platform === 'linkedin') {
        caption = `🚀 Excited to share our latest deep dive into: "${blogTitle}". Real-time collaboration is the future! #CollabTool #TechTalk`;
    } else if (platform === 'instagram') {
        caption = `📸 "${blogTitle}" — just published! Swipe to learn more. #CollabTool #AI #Tech`;
    } else {
        caption = `🗞️ New blog post: "${blogTitle}". Check it out now! #CollabTool`;
    }
    res.json({ caption });
};
