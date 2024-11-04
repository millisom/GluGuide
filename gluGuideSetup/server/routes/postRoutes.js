//Use Express Router in routes/postRoutes.js to define routes and connect them to the controller.
// this files contains routes related to post like CreatePost

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Import your controller

// Define the route for creating a post
router.post('/createPost', postController.createPost); // This is where the logic is wired up
router.get('/getUserPost', postController.getUserPost); //All posts for the logged in user
router.get('/getUserPost/:id', postController.getPostById); 
router.put('/posts/:id', postController.updatePost);

module.exports = router;

