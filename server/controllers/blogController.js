const db = require('../config/db');

// Get all blogs with filters
exports.getBlogs = async (req, res) => {
    try {
        const { category, status, search } = req.query;
        let query = `
            SELECT b.*, c.name as category_name, u.username as author_name 
            FROM blogs b
            LEFT JOIN blog_categories c ON b.category_id = c.id
            LEFT JOIN users u ON b.author_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            query += " AND c.slug = ?";
            params.push(category);
        }
        if (status) {
            query += " AND b.status = ?";
            params.push(status);
        }
        if (search) {
            query += " AND (b.title LIKE ? OR b.excerpt LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }

        query += " ORDER BY b.created_at DESC";

        const [results] = await db.query(query, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category_id, status, featured_image, seo_title, seo_description } = req.body;
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
        const author_id = req.user.id;

        const query = `
            INSERT INTO blogs (title, slug, content, excerpt, category_id, author_id, status, featured_image, seo_title, seo_description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [title, slug, content, excerpt, category_id, author_id, status, featured_image, seo_title, seo_description]);
        const blogId = result.insertId;

        // Auto-post to connected social platforms if blog is published
        let socialCount = 0;
        if (status === 'published') {
            const { autoPostBlog } = require('./socialController');
            socialCount = await autoPostBlog(blogId, title, author_id);
        }

        // Log activity
        if (req.io) {
            req.io.emit('log-activity', { 
                username: req.user.username, 
                action: `created a new blog post: ${title}` 
            });
        }

        res.status(201).json({ 
            id: blogId, 
            message: 'Blog created successfully',
            socialPosts: socialCount > 0 ? `Auto-posted to ${socialCount} platform(s)` : null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
    try {
        const query = `
            SELECT b.*, c.name as category_name, u.username as author_name 
            FROM blogs b
            LEFT JOIN blog_categories c ON b.category_id = c.id
            LEFT JOIN users u ON b.author_id = u.id
            WHERE b.slug = ?
        `;
        const [results] = await db.query(query, [req.params.slug]);
        
        if (results.length === 0) return res.status(404).json({ message: 'Blog not found' });
        
        // Update views
        await db.query("UPDATE blogs SET views = views + 1 WHERE id = ?", [results[0].id]);
        
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a blog
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category_id, status, featured_image, seo_title, seo_description } = req.body;
        const { id } = req.params;

        // Check ownership
        const [existing] = await db.query('SELECT * FROM blogs WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Blog not found' });

        const query = `
            UPDATE blogs 
            SET title = ?, content = ?, excerpt = ?, category_id = ?, status = ?,
                featured_image = ?, seo_title = ?, seo_description = ?, updated_at = NOW()
            WHERE id = ?
        `;
        await db.query(query, [title, content, excerpt, category_id, status, featured_image, seo_title, seo_description, id]);

        // Auto-post if published and was not published before
        let socialCount = 0;
        if (status === 'published' && existing[0].status !== 'published') {
            const { autoPostBlog } = require('./socialController');
            socialCount = await autoPostBlog(id, title, existing[0].author_id);
        }

        res.json({
            message: 'Blog updated successfully',
            socialPosts: socialCount > 0 ? `Auto-posted to ${socialCount} platform(s)` : null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT id FROM blogs WHERE id = ?', [id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Blog not found' });

        await db.query('DELETE FROM blogs WHERE id = ?', [id]);
        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get categories
exports.getCategories = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM blog_categories");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
