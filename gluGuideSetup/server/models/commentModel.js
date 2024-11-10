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

    // Method to get User from usertabel by name and get ID
    async getUserIdByUsername(username) {
        const query = 'SELECT id FROM users WHERE username = $1';
        const values = [username];
    
        try {
          const result = await pool.query(query, values);
          if (result.rows.length === 0){
            return null; 
          }
          return result.rows[0].id;
        } catch (error) {
            // Ensure error is handled properly
            throw new Error('Error fetching user ID: ' + error.message); // Create a new Error instance
        }
      },

    
     // Method to get all comments for a specific post
    async getCommentsByPostId(postId) {
        const query = `
        SELECT comments.*, users.username 
        FROM comments 
        JOIN users ON comments.author_id = users.id 
        WHERE comments.post_id = $1 
        ORDER BY comments.created_at DESC
        `;
        const values = [postId];

        try {
            const result = await pool.query(query, values);
            return result.rows; // Return all comments for the post
        } catch (error) {
            throw new Error('Error fetching comments for post: ' + error.message);
        }
    }
};


module.exports = Comment;

