const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/comments', commentController.createComment); 
router.get('/comments/:postId', commentController.getComments); 

module.exports = router;