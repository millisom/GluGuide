const Post = require('../models/postModel');
const Profile = require('../models/profileModel');

const postController = {

    async createPost(req, res) {
        const { title, content } = req.body; // Extract title and content from the request body
        const username = req.session?.username; // getting username from cookie

        if(!username){
          return res.status(401).send('Unauthorized');
        }

        try {
          // Retrieve the user_id based on the username
          const userId = await Post.getUserIdByUsername(username);
          const newPost = await Post.createPost(userId, title, content);
          return res.status(200).json({success: true, post: newPost});
        }catch (error) {
            console.error('Error creating post:', error.message);
            res.status(500).json({ success: false, message: 'Failed to create post.' });
        }   
    },


    async getUserPost(req, res) {
      console.log('Session:', req.session);
      const username = req.session?.username; // Getting username from session
  
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
        const { id } = req.params; // Get the post ID from request parameters

        try {
            const post = await Post.getPostById(id); // Call the model method to get the post

            if (!post) {
                return res.status(404).json({ message: 'Post not found' }); // If no post found
            }

            res.status(200).json(post); // Return the found post
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
  }
    
  };

module.exports = postController;
