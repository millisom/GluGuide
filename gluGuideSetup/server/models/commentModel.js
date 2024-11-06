const pool = require('../config/db'); // Import the database connection

const Comment = {
    async createComment(postId, authorId, content) {
        const query = 'INSERT INTO comments (post_id, author_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *';
        const values = [postId, authorId, content];
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating comment: ' + error.message);
        }
    },

    async getCommentsByPostId(postId) {
        const query = 'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC';
        const values = [postId];
        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching comments: ' + error.message);
        }
    }
};

module.exports = Comment;