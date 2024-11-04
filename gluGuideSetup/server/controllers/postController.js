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
      const username = req.session?.username; // Getting username from session
  
      if (!username) {
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
   }
  };

module.exports = postController;
