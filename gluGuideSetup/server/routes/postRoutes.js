const express = require('express');
const { createPost } = require('../controllers/postController');
const router = express.Router();

// Route to create a new blog post
router.post('/posts', createPost);

module.exports = router;
