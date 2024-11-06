//Use Express Router in routes/postRoutes.js to define routes and connect them to the controller.
// this files contains routes related to post like CreatePost

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Import your controller
const upload = require('../middleware/multer');

// Define the route for creating a post
router.post('/createPost', upload, postController.createPost); // This is where the logic is wired up
router.get('/getUserPost', postController.getUserPost); //All posts for the logged in user
router.get('/getUserPost/:id', postController.getPostById); //get specific post
router.put('/updatePost/:id', postController.updatePost); //update Post
router.delete('/deletePost/:id', postController.deletePost);

module.exports = router;

