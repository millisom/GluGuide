const pool = require('../config/db'); // Import the PostgreSQL connection pool
const { getUserByUsername } = require('./authModel'); // Import the method to get user ID by username

const Post = {
    // Method to create a new post
    async createPost(title, content, username) {
        // Fetch the user id based on username
        const user = await getUserByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }
        const userId = user.id; // Assuming the user object contains an id field

        const query = 'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [title, content, userId]; // Use user_id in the query
        try {
            const result = await pool.query(query, values);
            return result.rows[0]; // Return the newly created post
        } catch (error) {
            throw new Error('Error creating post: ' + error.message);
        }
    },

    // Method to fetch all posts
    async getAllPosts() {
        const query = 'SELECT * FROM posts ORDER BY created_at DESC'; // Fetch all posts
        try {
            const result = await pool.query(query);
            return result.rows; // Return all posts
        } catch (error) {
            throw new Error('Error fetching posts: ' + error.message);
        }
    },

    // Method to fetch a post by ID
    async getPostById(postId) {
        const query = 'SELECT * FROM posts WHERE id = $1';
        const values = [postId];
        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                throw new Error('Post not found');
            }
            return result.rows[0]; // Return the found post
        } catch (error) {
            throw new Error('Error fetching post: ' + error.message);
        }
    },

    // Method to delete a post by ID
    async deletePost(postId) {
        const query = 'DELETE FROM posts WHERE id = $1';
        const values = [postId];
        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                throw new Error('No post found to delete');
            }
            return result.rowCount; // Return the number of rows deleted
        } catch (error) {
            throw new Error('Error deleting post: ' + error.message);
        }
    }
};

module.exports = Post;
