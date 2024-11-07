const Comment = require('../models/commentModel');

const commentController = {

    async createComment(req, res) {
        const { post_id, content } = req.body; // Get post ID and content from the request body
        const username = req.session?.username;

        if (!username) {
            return res.status(401).send('Unauthorized');
        }

        try {
            // Retrieve the user ID based on the username
            const userId = await Comment.getUserIdByUsername(username);
            if (!userId) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Create the comment
            const newComment = await Comment.createComment(post_id, userId, content);
            return res.status(200).json({ success: true, comment: newComment });
        } catch (error) {
            console.error('Error creating comment:', error.message);
            res.status(500).json({ success: false, message: 'Failed to create comment.' });
        }
    },

    // method to get comments for a post
    async getComments(req, res) {
        const { post_id } = req.params;

        try {
            const comments = await Comment.getCommentsByPostId(post_id);
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error fetching comments:', error.message);
            res.status(500).json({ success: false, message: 'Failed to fetch comments.' });
        }
    },
};

module.exports = commentController;
