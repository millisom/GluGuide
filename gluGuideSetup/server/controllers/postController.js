const Post = require('../models/postModel');
const upload = require('../config/multerConfig'); 
const path = require('path');
const Profile = require('../models/profileModel');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

const {
  parseTagsFromRequest,
  deleteImageFile,
  getImagePath,
  createImageUrl,
  formatPostResponse
} = require('../helpers/postHelpers');

const postController = {
  // Create a new blog post
  async createPost(req, res) {
    upload.single('post_picture')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const { title, content, tags } = req.body; 
      const username = req.session?.username;
  
      if (!username) {
        return res.status(401).send('Unauthorized');
      }
  
      const postPicture = req.file ? req.file.filename : null;
      const tagsArray = parseTagsFromRequest(tags);

      try {
        // Log to debug issues
        console.log('Request body:', req.body);
        console.log('Parsed Tags:', tagsArray);
        console.log('Uploaded file:', req.file);

        if (!title) {
          return res.status(400).json({ success: false, message: 'Title is required.' });
        }

        const userId = await Post.getUserIdByUsername(username);
        const newPost = await Post.createPost(userId, title, content, postPicture, tagsArray); 
    
        const postWithDetails = await Post.getPostById(newPost.id);
        return res.status(200).json({ success: true, post: postWithDetails });
      } catch (error) {
        console.error('Error creating post:', error.message, error.stack);
        res.status(500).json({ success: false, message: 'Failed to create post.' });
      }
    });
  },

  // Get author profile information
  async getAuthorProfile(req, res) {
    const { username } = req.params;

    try {
      const data = await Post.getAuthorProfileByUsername(username);

      if (!data) {
        return res.status(404).json({ error: 'Author not found' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching author profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Get all posts ordered by creation time
  async getAllPosts(req, res) {
    try {
      const posts = await Post.getAllPostsOrderedByTime();

      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found' });
      }

      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  },

  // Get posts for the logged-in user
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

      return res.json(posts || []);
    } catch (error) {
      console.error('Error fetching posts for user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Get a specific post by ID
  async getPostById(req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    try {
      const post = await Post.getPostById(id);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Server error while fetching post' });
    }
  },

  // Alternative method to get a post (used by some routes)
  async getPost(req, res) {
    const { id } = req.params;
    try {
      const post = await Post.getPostById(id);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      return res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Update an existing post
  async updatePost(req, res) {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const username = req.session?.username;

    if (!username) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const tagsArray = parseTagsFromRequest(tags);

    try {
      const userResult = await Profile.getUserByName(username);
      
      if (!userResult || userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = userResult[0].id;
      const updatedPost = await Post.updatePost(id, userId, title, content, tagsArray);

      if (!updatedPost) {
        return res.status(404).json({ error: "Post not found or not authorized to update" });
      }

      return res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
      console.error('Error updating post:', error);
      const message = error.message || "Internal Server Error";
      return res.status(500).json({ error: message });
    }
  },

  // Handle post image upload
  async uploadPostImage(req, res) {
    upload.single('postImage')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(500).json({ error: 'File upload failed' });
      }

      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filename = req.file.filename;

      try {
        const post = await Post.getPostById(id);

        // Delete old image if it exists
        if (post && post.post_picture) {
          const oldImagePath = getImagePath(post.post_picture, __dirname);
          deleteImageFile(oldImagePath);
        }

        // Update database with new image
        const rowsUpdated = await Post.setPostImage(id, filename);

        if (rowsUpdated === 0) {
          return res.status(404).json({ error: "Post not found" });
        }

        return res.status(200).json({ 
          imageUrl: `${BASE_URL}/uploads/${filename}` 
        });
        
        
      } catch (error) {
        console.error('Error saving image:', error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    });
  },

  // Handle post image deletion
  async deletePostImage(req, res) {
    const { id } = req.params;
    
    try {
      const post = await Post.getPostById(id);

      if (!post || !post.post_picture) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Remove old file from disk
      const oldImagePath = getImagePath(post.post_picture, __dirname);
      deleteImageFile(oldImagePath);

      // Null out post_picture in DB
      const rowsUpdated = await Post.setPostImage(id, null);
      
      if (rowsUpdated === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error('Error deleting image:', error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Delete a post by ID
  async deletePost(req, res) {
    const { id } = req.params;

    try {
      const deleted = await Post.deletePostById(id);

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

  // Handle post like/unlike
  async toggleLike(req, res) {
    const { id: postId } = req.params;
    const userId = req.session?.userId;
  
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
  },

  // Get all available tags
  async getAllTags(req, res) {
    try {
      const tags = await Post.getAllTags();
      res.status(200).json(tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ message: 'Server error while fetching tags' });
    }
  }
};

module.exports = {
  ...postController,
  upload, // Export the upload middleware for route handling
};
