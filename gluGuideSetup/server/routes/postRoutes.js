//Use Express Router in routes/postRoutes.js to define routes and connect them to the controller.
// this files contains routes related to post like CreatePost

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Import your controller

// Define the route for creating a post
router.post('/posts', postController.createPost); // This is where the logic is wired up

module.exports = router;

