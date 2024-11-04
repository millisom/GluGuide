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



    async getPostById(req, res) {
      const { id } = req.params; // Get the post ID from request parameters

      try {
          const query = 'SELECT * FROM posts WHERE id = $1'; // SQL query to select the post
          const values = [id]; // Values for the SQL query
          const result = await pool.query(query, values); // Execute the query

          if (result.rows.length === 0) {
              return res.status(404).json({ message: 'Post not found' }); // If no post found
            }

          res.status(200).json(result.rows[0]); // Return the found post
      } catch (error) {
          console.error('Error fetching post:', error); // Log error
          res.status(500).json({ message: 'Server error while fetching post' }); // Return server error
        }
    },

    async updatePost(req, res) {
      const { id } = req.params; // Get the post ID from request parameters
      const { title, content } = req.body; // Extract title and content from request body

      try {
          const query = 'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *';
          const values = [title, content, id];
          const result = await pool.query(query, values);

          if (result.rowCount === 0) {
              return res.status(404).json({ message: 'Post not found' });
          }

          res.status(200).json(result.rows[0]); // Return the updated post
      } catch (error) {
          console.error('Error updating post:', error);
          res.status(500).json({ message: 'Server error while updating post' });
      }
  }
};

module.exports = postController;
