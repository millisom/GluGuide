//Use Express Router in routes/postRoutes.js to define routes and connect them to the controller.
// this files contains routes related to post like CreatePost

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Import your controller

// Define the route for creating a post
router.post('/createPost', postController.createPost); // This is where the logic is wired up
router.get('/getUserPost', postController.getUserPost); //All posts for the logged in user
router.get('/getUserPost/:id', postController.getPostById); //get specific post
router.put('/updatePost/:id', postController.updatePost); //update Post
router.delete('/deletePost/:id', postController.deletePost);
router.get('/getAllPosts', postController.getAllPosts);
router.post('/uploadPostImage/:id', postController.uploadPostImage);
router.delete('/deletePostImage/:id', postController.deletePostImage);

// Route to get all unique tags
router.get('/tags', postController.getAllTags);

// Route to like or unlike a post
router.post('/toggleLike/:id', postController.toggleLike);

// Route for Admin to edit specific post
router.get('/getPost/:id', postController.getPostById);

//Router for author profile
router.get('/profile/:username', postController.getAuthorProfile);


module.exports = router;
