const argon2 = require('argon2'); // for password hashing
const pool = require('../config/db');

const adminController = {

    // List all users
    listUsers: async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT id, username, email, created_at, is_admin FROM users ORDER BY created_at DESC'
            );

            res.status(200).json(result.rows);
        } catch (err) {
            console.error('Error retrieving users:', err);
            res.status(500).json({ error: 'Server error retrieving users.' });
        }
    },

    // Create a new user
    createUser: async (req, res) => {
        const { username, email, password, termsAccepted, is_admin } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required.' });
        }

        try {
            // Check if user already exists by email
            const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (existingUser.rows.length > 0) {
                return res.status(409).json({ error: 'User already exists.' });
            }

            // Hash the password securely
            const hashedPassword = await argon2.hash(password);

            // Insert the new user into the database
            const result = await pool.query(
                `INSERT INTO users (username, email, password_hash, terms_accepted, is_admin) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, is_admin`,
                [username, email, hashedPassword, termsAccepted || false, is_admin || false]
            );

            res.status(201).json(result.rows[0]);

        } catch (err) {
            console.error('Error creating new user:', err);
            res.status(500).json({ error: 'Server error creating new user.' });
        }
    },

    // Edit an existing user
    editUser: async (req, res) => {
        const userId = req.params.id;
        const { username, email, is_admin } = req.body;

        try {
            // Fetch existing user
            const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

            if (existingUser.rows.length === 0) {
                return res.status(404).json({ error: 'User not found.' });
            }

            // Update user details
            const updatedUser = await pool.query(
                `UPDATE users SET 
              username = COALESCE($1, username), 
              email = COALESCE($2, email), 
              is_admin = COALESCE($3, is_admin)
             WHERE id = $4
             RETURNING id, username, email, is_admin`,
                [username, email, is_admin, userId]
            );

            res.status(200).json(updatedUser.rows[0]);

        } catch (err) {
            console.error('Error editing user:', err);
            res.status(500).json({ error: 'Server error editing user.' });
        }
    },

    // Delete a user by id
    deleteUser: async (req, res) => {
        const userId = req.params.id;

        try {
            // First check if user exists
            const existingUser = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

            if (existingUser.rows.length === 0) {
                return res.status(404).json({ error: 'User not found.' });
            }

            // Delete the user
            await pool.query('DELETE FROM users WHERE id = $1', [userId]);

            res.status(200).json({ message: 'User deleted successfully.' });

        } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ error: 'Server error deleting user.' });
        }
    },

    // Edit a post by id
    editPost: async (req, res) => {
        const postId = req.params.id;
        const { title, content } = req.body;

        try {
            // Check if post exists
            const existingPost = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);

            if (existingPost.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found.' });
            }

            // Update the post details
            const updatedPost = await pool.query(
                `UPDATE posts SET
              title = COALESCE($1, title),
              content = COALESCE($2, content),
              updated_at = NOW()
             WHERE id = $3
             RETURNING id, title, content, updated_at`,
                [title, content, postId]
            );

            res.status(200).json(updatedPost.rows[0]);

        } catch (err) {
            console.error('Error editing post:', err);
            res.status(500).json({ error: 'Server error editing post.' });
        }
    },

    // Delete a post by id
    deletePost: async (req, res) => {
        const postId = req.params.id;

        try {
            // First verify if the post exists
            const existingPost = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);

            if (existingPost.rows.length === 0) {
                return res.status(404).json({ error: 'Post not found.' });
            }

            // Delete the post
            await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

            res.status(200).json({ message: 'Post deleted successfully.' });

        } catch (err) {
            console.error('Error deleting post:', err);
            res.status(500).json({ error: 'Server error deleting post.' });
        }
    },

    // Edit a comment by id
    editComment: async (req, res) => {
        const commentId = req.params.id;
        const { content } = req.body;

        try {
            // Verify if the comment exists
            const existingComment = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);

            if (existingComment.rows.length === 0) {
                return res.status(404).json({ error: 'Comment not found.' });
            }

            // Update the comment content
            const updatedComment = await pool.query(
                `UPDATE comments SET content = COALESCE($1, content), updated_at = NOW()
             WHERE id = $2 RETURNING id, content, updated_at`,
                [content, commentId]
            );

            res.status(200).json(updatedComment.rows[0]);

        } catch (err) {
            console.error('Error editing comment:', err);
            res.status(500).json({ error: 'Server error editing comment.' });
        }
    },

    deleteComment: async (req, res) => {
        const commentId = req.params.id;
    
        try {
          // First, verify if the comment exists
          const existingComment = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    
          if (existingComment.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found.' });
          }
    
          // Delete the comment
          await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    
          res.status(200).json({ message: 'Comment deleted successfully.' });
    
        } catch (err) {
          console.error('Error deleting comment:', err);
          res.status(500).json({ error: 'Server error deleting comment.' });
        }
      },
};

module.exports = adminController;
