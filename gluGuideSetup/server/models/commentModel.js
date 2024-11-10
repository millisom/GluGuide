const pool = require('../config/db'); // Import the database connection

const Comment = {

    // Method to create a comment
    async createComment(postId, userId, content) {
        const query = 'INSERT INTO comments (post_id, author_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *';
        const values = [postId, userId, content];
        try {
            const result = await pool.query(query, values);
            return result.rows[0]; // Return the newly created comment
        } catch (error) {
            throw new Error('Error creating comment: ' + error.message);
        }
    },

    // Method to get user ID by username
    async getUserIdByUsername(username) {
        const query = 'SELECT id FROM users WHERE username = $1';
        const values = [username];
        try {
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0].id;
        } catch (error) {
            throw new Error('Error fetching user ID: ' + error.message);
        }
    },

    
     // Method to get all comments for a specific post
    async getCommentsByPostId(postId) {
        const query = `
        SELECT comments.*, users.username 
        FROM comments 
        JOIN users ON comments.author_id = users.id 
        WHERE comments.post_id = $1 
        ORDER BY comments.created_at DESC
        `;
        const values = [postId];

        try {
            const result = await pool.query(query, values);
            return result.rows; // Return all comments for the post
        } catch (error) {
            throw new Error('Error fetching comments for post: ' + error.message);
        }
    },

    async toggleLike(commentId, userId) {
        const queryCheckDislike = 'SELECT dislikes FROM comments WHERE id = $1';
        const queryUpdateLikes = `
          UPDATE comments 
          SET likes = CASE WHEN likes = 0 THEN likes + 1 ELSE likes - 1 END, 
              dislikes = CASE WHEN dislikes > 0 THEN dislikes - 1 ELSE dislikes END 
          WHERE id = $1 RETURNING likes, dislikes
        `;
        try {
          // First, check if the user has disliked the comment
          const resultCheck = await pool.query(queryCheckDislike, [commentId]);
          const dislikes = resultCheck.rows[0].dislikes;
    
          // If user has disliked, remove a dislike before adding a like
          const resultUpdate = await pool.query(queryUpdateLikes, [commentId]);
          return resultUpdate.rows[0]; // Return updated likes and dislikes count
        } catch (error) {
          throw new Error('Error toggling like: ' + error.message);
        }
      },
    
      async toggleDislike(commentId, userId) {
        const queryCheckLike = 'SELECT likes FROM comments WHERE id = $1';
        const queryUpdateDislikes = `
          UPDATE comments 
          SET dislikes = CASE WHEN dislikes = 0 THEN dislikes + 1 ELSE dislikes - 1 END, 
              likes = CASE WHEN likes > 0 THEN likes - 1 ELSE likes END 
          WHERE id = $1 RETURNING likes, dislikes
        `;
        try {
          // First, check if the user has liked the comment
          const resultCheck = await pool.query(queryCheckLike, [commentId]);
          const likes = resultCheck.rows[0].likes;
    
          // If user has liked, remove a like before adding a dislike
          const resultUpdate = await pool.query(queryUpdateDislikes, [commentId]);
          return resultUpdate.rows[0]; // Return updated likes and dislikes count
        } catch (error) {
          throw new Error('Error toggling dislike: ' + error.message);
        }
    }
};


module.exports = Comment;

