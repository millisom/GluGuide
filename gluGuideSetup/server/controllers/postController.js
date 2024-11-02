const Post = require('../models/postModel');

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({ title, content });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};
