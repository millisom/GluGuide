const pool = require('../config/db'); // Import the database connection

const Comment = {

    // Method to create a comment
    async createComment(postId, userId, content) {
        const query = 'INSERT INTO comments (post_id, author_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *';
        const values = [postId, userId, content];
        try {
            const result = await pool.query(query, values);
            return result.rows[0]; // Return the newly created comment
        } catch (error) {
            throw new Error('Error creating comment: ' + error.message);
        }
    },

    // Method to get user ID by username
    async getUserIdByUsername(username) {
        const query = 'SELECT id FROM users WHERE username = $1';
        const values = [username];
        try {
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0].id;
        } catch (error) {
            throw new Error('Error fetching user ID: ' + error.message);
        }
    },
};

module.exports = Comment;

