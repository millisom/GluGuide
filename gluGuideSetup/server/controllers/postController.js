const pool = require('../config/db'); // Database connection
const { getUserByUsername } = require('../models/authModel');

const postController = {
    async createPost(req, res) {
        const { title, content, username } = req.body; // Extract title and content from the request body
        const userId = req.user.id; // Assuming user ID is retrieved from the authenticated user

        // Validate the input
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required.' });
        }

        try {

          // Retrieve the user_id based on the username
          const userId = await getUserByUsername(username);
          if (!userId) {
              return res.status(404).json({ success: false, message: 'User not found.' });
          } 
        }catch (error) {
            console.error('Error finding user:', error);
            res.status(500).json({ success: false, message: 'Failed to find user.' });
        }
        
        try {
            const query = 'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *';
            const values = [title, content, userId];
            const result = await pool.query(query, values); // Save to the database

            res.status(201).json({ success: true, message: 'Post created successfully!', post: result.rows[0] });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ success: false, message: 'Failed to create post.' });
        }
    },
};

module.exports = postController;
