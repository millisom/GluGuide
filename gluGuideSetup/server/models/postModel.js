const pool = require('../config/db'); // Import the PostgreSQL connection pool

const Post = {
    // Method to create a new post
    async createPost(userId, title, content) {
        const query = 'INSERT INTO posts (user_id, title, content,created_at) VALUES ($1, $2, $3, NOW()) RETURNING *';
        const values = [userId, title, content,]; // Use user_id in the query
        try {
            const result = await pool.query(query, values);
            return result.rows[0]; // Return the newly created post
        } catch (error) {
            throw new Error('Error creating post: ' + error.message);
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
      }



};

module.exports = Post;
