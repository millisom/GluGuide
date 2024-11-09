const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/comments', commentController.createComment); 
router.get('/comments/:post_id', commentController.getComments);
router.post('/comments/:id/like', commentController.toggleLike);
router.post('/comments/:id/dislike', commentController.toggleDislike);

module.exports = router;