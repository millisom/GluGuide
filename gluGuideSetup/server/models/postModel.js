const pool = require('../config/db'); // Import the PostgreSQL connection pool

const Post = {
  // Method to create a new post
  async createPost(userId, title, content, postPicture) {
    const query = 'INSERT INTO posts (user_id, title, content, created_at, post_picture) VALUES ($1, $2, $3, NOW(), $4) RETURNING *';
    const values = [userId, title, content, postPicture]; // Use user_id in the query
    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the newly created post
    } catch (error) {
      throw new Error('Error creating post: ' + error.message);
    }
  },

  // Method to get User from usertabel by name and get ID
  async getUserIdByUsername(username) {
    const query = 'SELECT id FROM users WHERE username = $1';
    const values = [username];

    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0){
        return null; 
      }
      return result.rows[0].id;
    } catch (error) {
      // Ensure error is handled properly
      throw new Error('Error fetching user ID: ' + error.message); // Create a new Error instance
    }
  },

  async getAllPostsOrderedByTime() {
    const query = `
      SELECT 
        posts.*, 
        users.username, 
        array_length(posts.likes, 1) AS likes_count
      FROM 
        posts
      JOIN 
        users ON posts.user_id = users.id
      ORDER BY 
        posts.created_at DESC
    `;
    try {
      const result = await pool.query(query);
      return result.rows; // Return all posts ordered by creation date, newest first
    } catch (error) {
      throw new Error('Error fetching posts: ' + error.message);
    }
  },

  // Method to get all posts for a specific user
  async getPosts(userId) {
    const query = `
        SELECT 
            posts.*, 
            array_length(posts.likes, 1) AS likes_count  -- Count of likes
        FROM 
            posts 
        WHERE 
            user_id = $1
    `;
    const values = [userId];
    try {
        const result = await pool.query(query, values);
        console.log('Posts:', result.rows);
        return result.rows;
    } catch (error) {
        throw new Error('Error fetching posts for user: ' + error.message);
    }
  },

  async updatePostForUser(userId, title, content) {
    const values = [title, content, userId];
    const query = 'UPDATE posts SET title = $1, content = $2 WHERE user_id = $3';
    try {
      const result = await pool.query(query, values);
      return result.rowCount;
    } catch (error) {
      throw new Error('Error updating post for user: ' + error.message);
    }
  },

  async updatePost(postId, userId, title, content) {
    const query = 'UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *';
    const values = [title, content, postId, userId]; // Correct order of parameters

    try {
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return null; // No post was updated
        }
        return result.rows[0]; // Return the updated post
    } catch (error) {
        throw new Error('Error updating post: ' + error.message);
    }
},

  async getPostById(postId) {
    const query = `
      SELECT posts.*, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id
      WHERE posts.id = $1
    `;
    const values = [postId];

    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return null; // No post found
      }
      return result.rows[0]; // Return the found post
    } catch (error) {
      throw new Error('Error fetching post: ' + error.message);
    }
  },

  async setPostImage(id, imagePath) {
    const query = 'UPDATE posts SET post_picture = $1 WHERE id = $2';
    try {
        const result = await pool.query(query, [imagePath, id]);
        return result.rowCount;
    } catch (error) {
        throw new Error('Error setting post image: ' + error.message);
    }
},


  async deletePostById(id) {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *';
    const values = [id];

    try {
      const result = await pool.query(query, values);
      return result.rowCount; 
    } catch (error) {
      throw new Error('Error deleting post: ' + error.message);
    }
  },

  async toggleLike(postId, userId) {
    const queryGetLikes = 'SELECT likes FROM posts WHERE id = $1';
    const queryUpdateLikes = 'UPDATE posts SET likes = $1 WHERE id = $2 RETURNING *';

    try {
        // Get the current likes array
        const result = await pool.query(queryGetLikes, [postId]);
        if (result.rows.length === 0) {
            throw new Error('Post not found');
        }

        let likes = result.rows[0].likes || []; // Get existing likes or initialize as an empty array

        // Check if the userId already liked the post
        if (likes.includes(userId)) {
            // Unlike: Remove userId from the likes array
            likes = likes.filter(id => id !== userId);
        } else {
            // Like: Add userId to the likes array
            likes.push(userId);
        }

        // Update the likes in the database
        const updateResult = await pool.query(queryUpdateLikes, [likes, postId]);
        return updateResult.rows[0];
    } catch (error) {
        throw new Error('Error toggling like: ' + error.message);
    }
  },

  async updateLikes(postId, likes) {
    const query = 'UPDATE posts SET likes = $1 WHERE id = $2 RETURNING *';
    const values = [likes, postId];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating likes: ' + error.message);
    }
  }  
};

module.exports = Post;
