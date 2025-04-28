const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { validateRecipe } = require('../middleware/validationMiddleware');

// Routes for Recipes
router.get('/recipes', recipeController.getAllRecipes);             // GET all recipes
router.get('/recipes/:id', recipeController.getRecipeById);         // GET recipe by ID
router.get('/recipes/search/name', recipeController.getRecipeByName);    // GET recipe by name
router.post('/recipes', validateRecipe, recipeController.createRecipe); // POST create recipe
router.put('/recipes/:id', validateRecipe, recipeController.updateRecipe); // PUT update recipe
router.delete('/recipes/:id', recipeController.deleteRecipe);       // DELETE recipe
router.post('/recipes/log', recipeController.logRecipe);            // POST log recipe action

module.exports = router;
