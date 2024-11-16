const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


router.post('/comments', commentController.createComment); 
router.get('/comments/:post_id', commentController.getComments);
router.delete('/comments/:commentId', commentController.deleteComment);
router.post('/comments/:id/like', commentController.toggleLike);
router.post('/comments/:id/dislike', commentController.toggleDislike);
router.put('/comments/:commentId', commentController.editComment);


module.exports = router;