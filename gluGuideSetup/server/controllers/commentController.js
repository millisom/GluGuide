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

    // New method to get comments for a post
    // async getComments(req, res) {
    //     const { post_id } = req.params;

    //     try {
    //         const comments = await Comment.getCommentsByPostId(post_id);
    //         res.status(200).json(comments);
    //     } catch (error) {
    //         console.error('Error fetching comments:', error.message);
    //         res.status(500).json({ success: false, message: 'Failed to fetch comments.' });
    //     }
    // },

        async getComments(req, res) {
        const { post_id } = req.params;

        try {
            const comments = await Comment.getCommentsByPostId(post_id);
            const username = req.session?.username;
            const currentUserId = await Comment.getUserIdByUsername(username);
            res.status(200).json({ comments,  currentUserId}); // Send currentUserId in the response
        } catch (error) {
            console.error('Error fetching comments:', error.message);
            res.status(500).json({ success: false, message: 'Failed to fetch comments.' });
        }
    },


    // Method to delete a comment 
    async deleteComment(req, res) {
        const { commentId } = req.params;
        const username = req.session?.username;

        if (!username) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            // Get the user ID from the username
            const userId = await Comment.getUserIdByUsername(username);
            if (!userId) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the comment belongs to the user
            const comment = await Comment.getCommentById(commentId);
            if (!comment || comment.author_id !== userId) {
                return res.status(403).json({ message: 'You can only delete your own comments' });
            }

            // Delete the comment
            await Comment.deleteCommentById(commentId);
            res.status(200).json({ success: true, message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error deleting comment:', error.message);
            res.status(500).json({ success: false, message: 'Failed to delete comment' });
        }
    }
};

module.exports = commentController;
