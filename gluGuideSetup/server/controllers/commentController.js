const Comment = require('../models/commentModel');

const commentController = {
    async createComment(req, res) {
        const { postId, content } = req.body;
        // const authorId = req.session?.userId; // Assuming userId is stored in session
        const authorId = 23;

        // if (!authorId) {
        //     return res.status(401).send('Unauthorized');
        // }

        try {
            const newComment = await Comment.createComment(postId, authorId, content);
            res.status(200).json({ success: true, comment: newComment });
        } catch (error) {
            console.error('Error creating comment:', error.message);
            res.status(500).json({ success: false, message: 'Failed to create comment.' });
        }
    },

    async getComments(req, res) {
        try {
            const comments = await Comment.getCommentsByPostId(postId);
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error fetching comments:', error.message);
            res.status(500).json({ success: false, message: 'Failed to fetch comments.' });
        }
    }
};

module.exports = commentController;