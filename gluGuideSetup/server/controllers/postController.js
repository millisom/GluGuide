const Post = require('../models/postModel');
const upload = require('../middleware/multer');  // Import multer middleware
const path = require('path');
const Profile = require('../models/profileModel');

const postController = {

  async createPost(req, res) {
    const { title, content } = req.body; // Extract title and content from the request body
    const username = req.session?.username; // getting username from cookie

    if(!username){
      return res.status(401).send('Unauthorized');
    }
    const postPicture = req.file ? req.file.filename : null;

    try {
      // Retrieve the user_id based on the username
      const userId = await Post.getUserIdByUsername(username);
      const newPost = await Post.createPost(userId, title, content, postPicture);

      return res.status(200).json({success: true, post: newPost});
    }catch (error) {
        console.error('Error creating post:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Failed to create post.' });
    }
  },

  async getAllPosts(req, res){
    try {
      // Fetch all posts and sort by creation date in descending order
      const posts = await Post.getAllPostsOrderedByTime();

      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found' });
      }

      res.json(posts); // Return posts as JSON
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  },


  async getUserPost(req, res) {
    console.log('Session:', req.session);
    const username = req.session?.username;

    if (!username) {
      console.log('Unauthorized access attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userResult = await Profile.getUserByName(username);
          
      if (!userResult || userResult.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }
      const userId = userResult[0].id;
      const posts = await Post.getPosts(userId);

      // Return posts including likes count
      return res.json(posts || []);
    } catch (error) {
      console.error('Error fetching posts for user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Get a specific post by ID
  async getPostById(req, res) {
    const { id } = req.params; // Get the post ID from request parameters

    // Check if ID is valid (number in this case, assuming posts have integer IDs)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    try {
      const post = await Post.getPostById(id); // Call the model method to get the post

      if (!post) {
          return res.status(404).json({ message: 'Post not found' }); // If no post found
      }

      // Format the post data for response
      const formattedPost = {
        id: post.id,                // Include id
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at || null,
        post_picture: post.post_picture,
        username: post.username,
        likes: post.likes || [],     // Include likes
      };      

      res.status(200).json(formattedPost); // Return formatted post data
    } catch (error) {
      console.error('Error fetching post:', error); // Log error
      res.status(500).json({ message: 'Server error while fetching post' }); // Return server error
    }
  },

  async updatePost(req, res) {
    const { id } = req.params; // Get the post ID from request parameters
    const { title, content } = req.body; // Extract title and content from request body
    const username = req.session?.username; // Getting username from session
  
    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      // Retrieve the user ID based on the username
      const userResult = await Profile.getUserByName(username);

      if (!userResult || userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const userId = userResult[0].id;

      // Call the model method to update the post
      const updatedPost = await Post.updatePost(id, userId, title, content);

      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      return res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
      console.error('Error updating post:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Delete a specific post by ID
  async deletePost(req, res) {
    const { id } = req.params; // Get the post ID from request parameters

    try {
      const deleted = await Post.deletePostById(id); // Call the model method to delete the post

      if (deleted) {
        return res.status(200).json({ message: 'Post deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async toggleLike(req, res) {
    const { id: postId } = req.params;
    const userId = req.session?.userId; // Check if userId exists in the session
  
    console.log('User ID from session in toggleLike:', userId);
  
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const post = await Post.getPostById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const likes = post.likes || [];
      const isLiked = likes.includes(userId);
      const updatedLikes = isLiked ? likes.filter(id => id !== userId) : [...likes, userId];
  
      await Post.updateLikes(postId, updatedLikes);
      res.status(200).json({ success: true, likesCount: updatedLikes.length });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }  
};

module.exports = {
  ...postController,
  upload, // Export the upload middleware for route handling
};
