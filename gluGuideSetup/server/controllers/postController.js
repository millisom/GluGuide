const Post = require('../models/postModel');
const upload = require('../middleware/multer');  // Import multer middleware
const path = require('path');
const fs = require('fs');
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


      async getUserPosts(req, res) {
        try {
            // Check if the session has a username
            const username = req.session?.username;
            if (!username) {
                console.warn('Unauthorized access attempt: session missing username');
                return res.status(401).json({ error: 'Unauthorized' });
            }
    
            console.log(`Fetching user by username: ${username}`);
            
            // Query for user by username
            const userResult = await Profile.getUserByName(username);
    
            if (!userResult || userResult.length === 0) {
                console.warn(`User not found for username: ${username}`);
                return res.status(404).json({ error: 'User not found' });
            }
            
            const userId = userResult[0].id;
            console.log(`User found with ID: ${userId}, fetching posts...`);
    
            // Query for posts by user ID
            const posts = await Post.getPosts(userId);
    
            if (!posts) {
                console.warn(`No posts found for user ID: ${userId}`);
                return res.json([]);  // Return an empty array if no posts found
            }
    
            console.log(`Fetched ${posts.length} posts for user ID: ${userId}`);
            return res.json(posts);
    
        } catch (error) {
            console.error('Error fetching posts for user:', error);  // Log full error details
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
              title: post.title,
              content: post.content,
              created_at: post.created_at,
              updated_at: post.updated_at || null, // Only include if it exists
              post_picture: post.post_picture,
              username: post.username, // Assuming this is part of your post data after the join
          };
  
          res.status(200).json(formattedPost); // Return formatted post data
      } catch (error) {
          console.error('Error fetching post:', error); // Log error
          res.status(500).json({ message: 'Server error while fetching post' }); // Return server error
      }
  },

  async updatePost(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;
    const username = req.session?.username;

    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const userResult = await Profile.getUserByName(username);

        if (!userResult || userResult.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userId = userResult[0].id;

        const post = await Post.getPostById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        let updatedImage = post.post_picture;
        if (req.file) {
            // Delete the old image if a new one is uploaded
            const oldImagePath = path.join(__dirname, '..', 'uploads', post.post_picture);
            fs.unlinkSync(oldImagePath); // Delete old image asynchronously

            updatedImage = req.file.filename;
        } else {
            // If no new image is provided, ensure the old image stays or set it to null
            updatedImage = post.post_picture; // or `null` if you want to remove it
        }

        const updatedPost = await Post.updatePost(id, userId, title, content, updatedImage);

        if (!updatedPost) {
            return res.status(404).json({ message: 'Failed to update post' });
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

  async deleteImage(req, res) {
    const { id } = req.params; // Get the post ID from request parameters
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
 
        // Retrieve the post
        const post = await Post.getPostById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
 
        // Check if the user owns the post
        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You do not own this post' });
        }
 
        if (!post.post_picture) {
            return res.status(400).json({ error: 'No image to delete' });
        }
 
        const imagePath = path.join(__dirname, '..', 'uploads', post.post_picture);
 
        // Delete the image file from the filesystem
        fs.unlink(imagePath, async (err) => {
            if (err) {
                console.error('Error deleting image file:', err);
                return res.status(500).json({ error: 'Failed to delete image file' });
            }
 
            // Update the post's post_picture to null in the database
            const updated = await Post.updatePostImage(id, null); // Assume this method exists
 
            if (!updated) {
                return res.status(500).json({ error: 'Failed to update post after image deletion' });
            }
 
            return res.status(200).json({ message: 'Image deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
 }
 ,

    async uploadImage(req, res) {
      const { id } = req.params; // Get the post ID from request parameters
      const username = req.session?.username; // Getting username from session
   
      if (!username) {
          return res.status(401).json({ error: 'Unauthorized' });
      }
   
      // Use multer middleware to handle file upload
      upload.single('image')(req, res, async function(err) {
          if (err instanceof multer.MulterError) {
              console.error('Multer error:', err);
              return res.status(500).json({ error: 'Multer error occurred during upload' });
          } else if (err) {
              console.error('Unknown upload error:', err);
              return res.status(500).json({ error: 'Unknown error occurred during upload' });
          }
   
          if (!req.file) {
              return res.status(400).json({ error: 'No image file provided' });
          }
   
          try {
              // Retrieve the user ID based on the username
              const userResult = await Profile.getUserByName(username);
              if (!userResult || userResult.length === 0) {
                  return res.status(404).json({ error: 'User not found' });
              }
              const userId = userResult[0].id;
   
              // Retrieve the post
              const post = await Post.getPostById(id);
              if (!post) {
                  // Delete the uploaded file since the post doesn't exist
                  fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename), () => {});
                  return res.status(404).json({ error: 'Post not found' });
              }
   
              // Check if the user owns the post
              if (post.user_id !== userId) {
                  // Delete the uploaded file since the user doesn't own the post
                  fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename), () => {});
                  return res.status(403).json({ error: 'Forbidden: You do not own this post' });
              }
   
              // If there's an existing image, delete it
              if (post.post_picture) {
                  const oldImagePath = path.join(__dirname, '..', 'uploads', post.post_picture);
                  fs.unlink(oldImagePath, (err) => {
                      if (err) {
                          console.error('Error deleting old image file:', err);
                          // Proceed even if deleting the old image fails
                      }
                  });
              }
   
              // Update the post's post_picture with the new image filename
              const updated = await Post.updatePostImage(id, req.file.filename); 
   
              if (!updated) {
                  // Delete the uploaded file since the database update failed
                  fs.unlink(path.join(__dirname, '..', 'uploads', req.file.filename), () => {});
                  return res.status(500).json({ error: 'Failed to update post with new image' });
              }
   
              // Construct the image URL
              const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
   
              return res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
          } catch (error) {
              console.error('Error uploading image:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
      });
   }
  };

module.exports = {
  ...postController,
  upload, // Export the upload middleware for route handling
};
