const Post = require('../models/postModel');

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
            console.error('Error finding user:', error);
            res.status(500).json({ success: false, message: 'Failed to create post.' });
        }

        
    },
    async getUserPosts(req, res) {
      const username = req.session?.username; // Getting username from session
  
      if (!username) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
  
      try {
        const userId = await Post.getUserIdByUsername(username);
        const posts = await Post.getPostsByUserId(userId);
        return res.status(200).json(posts); // Send posts as JSON
      } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve posts.' });
      }
    },
  };

module.exports = postController;
