const Post = require('../models/postModel');
const upload = require('../config/multerConfig');  // Import multer middleware
const path = require('path');
const Profile = require('../models/profileModel');
const fs = require('fs');

const createImageUrl = (req, filename) => {
    return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

const postController = {

  async createPost(req, res) {

    upload.single('post_picture')(req, res, async (err) => {
      if (err) {
          console.error('Multer error:', err);
          return res.status(500).json({ error: 'File upload failed' });
      }


    const { title, content } = req.body; // Extract title and content from the request body
    const username = req.session?.username; // getting username from cookie
  
    if (!username) {
      return res.status(401).send('Unauthorized');
    }
  
    const postPicture = req.file ? req.file.filename : null;
  
    try {
      // Log to debug issues
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);

      if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required.' });
      }
      const userId = await Post.getUserIdByUsername(username);
      const newPost = await Post.createPost(userId, title, content, postPicture);
  
      return res.status(200).json({ success: true, post: newPost });
    } catch (error) {
      console.error('Error creating post:', error.message, error.stack);
      res.status(500).json({ success: false, message: 'Failed to create post.' });
    }
  })
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

async updatePost(req, res) {
  const { id } = req.params;  // The post ID from the URL params
  const { title, content } = req.body;  // The title and content from the request body
  const username = req.session?.username; // The username from the session

  if (!username) {
      return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
      // Retrieve the user ID based on the username
      const userResult = await Profile.getUserByName(username);
      if (!userResult || userResult.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      const userId = userResult[0].id;  // Assuming the user ID is in the first row

      // Call the model method to update the post with the userId and postId
      const updatedPost = await Post.updatePost(id, userId, title, content);

      if (!updatedPost) {
          return res.status(404).json({ error: "Post not found" });
      }

      return res.status(200).json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
},

async uploadPostImage(req, res) {
  // Use multer to handle the file upload
  upload.single('postImage')(req, res, async (err) => {
      if (err) {
          console.error('Multer error:', err);
          return res.status(500).json({ error: 'File upload failed' });
      }

      const { id } = req.params;

      // Check if a file is uploaded
      if (req.file) {
          // Use only the filename, not the full path
          const filename = req.file.filename;  // Just use the filename like 1731840320864-cat-8185712_1280.jpg

          try {
              // Get the current post from the database
              const post = await Post.getPostById(id);
              
              if (post && post.image_url) {
                  // If the post already has an image, delete the old one from the server
                  const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(post.image_url));
                  fs.unlink(oldImagePath, (err) => {
                      if (err) console.error('Error deleting old image:', err);
                  });
              }

              // Save the new image filename to the database (not the full URL)
              const rowsUpdated = await Post.setPostImage(id, filename);

              if (rowsUpdated === 0) {
                  return res.status(404).json({ error: "Post not found" });
              }

              // Return the relative URL to the image (we're only sending the filename to the client)
              return res.status(200).json({ imageUrl: `http://localhost:8080/uploads/${filename}` });
          } catch (error) {
              console.error('Error saving image:', error);
              return res.status(500).json({ error: "Internal Server Error" });
          }
      } else {
          return res.status(400).json({ error: 'No file uploaded' });
      }
  });
},

async uploadPostImageInCreate(req, res) {
  // Use multer to handle the file upload
  upload.single('postImage')(req, res, async (err) => {
      if (err) {
          console.error('Multer error:', err);
          return res.status(500).json({ error: 'File upload failed' });
      }

      // Check if a file is uploaded
      if (req.file) {
          // Use only the filename, not the full path
          const filename = req.file.filename;  // Just use the filename like 1731840320864-cat-8185712_1280.jpg

          try {
              // Get the current post from the database
              const post = await Post.getPostById(id);
              
              if (post && post.image_url) {
                  // If the post already has an image, delete the old one from the server
                  const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(post.image_url));
                  fs.unlink(oldImagePath, (err) => {
                      if (err) console.error('Error deleting old image:', err);
                  });
              }

              // Save the new image filename to the database (not the full URL)
              const rowsUpdated = await Post.setPostImage(id, filename);

              if (rowsUpdated === 0) {
                  return res.status(404).json({ error: "Post not found" });
              }

              // Return the relative URL to the image (we're only sending the filename to the client)
              return res.status(200).json({ imageUrl: `http://localhost:8080/uploads/${filename}` });
          } catch (error) {
              console.error('Error saving image:', error);
              return res.status(500).json({ error: "Internal Server Error" });
          }
      } else {
          return res.status(400).json({ error: 'No file uploaded' });
      }
  });
},

async deletePostImage(req, res) {
    const { id } = req.params;
    try {
        const post = await Post.getPostById(id);
        if (!post || !post.image_url) {
            return res.status(404).json({ error: "Image not found" });
        }

        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(post.image_url));
        fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting image:', err);
        });

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
