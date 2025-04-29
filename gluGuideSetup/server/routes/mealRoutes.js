const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');

// Create a meal
router.post('/createMeal', mealController.createMeal);

// Get meal with food items
router.get('/getMealBy/:id', mealController.getMealById);

// Get all meals for a user
router.post('/getAllMealsFor/user', mealController.getMealsByUser);

// Recalculate and update nutrition totals
router.put('/:id/recalculate', mealController.updateMealNutrition);

module.exports = router;
