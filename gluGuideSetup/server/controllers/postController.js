const pool = require('../config/db');
const Post = require('../models/postModel');
const { getUserByUsername } = require('../models/authModel'); 


const express = require('express');
const { createPost } = require('../controllers/postController');
const router = express.Router();

router.post('/posts', createPost);  

const postController = {
  async createPost(req, res) {
      const { title, content } = req.body; // Extract title and content from the request body
      const userId = req.user.id; // Assuming user ID is retrieved from authenticated user

      // Validate the input
      if (!title || !content) {
          return res.status(400).json({ success: false, message: 'Title and content are required.' });
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