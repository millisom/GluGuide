const express = require('express');
const router = express.Router();
const foodItemController = require('../controllers/foodItemController');
const { validateFoodItem } = require('../middleware/validationMiddleware');

// Routes for Food Items (CRUD)
router.get('/getAllFoodItems', foodItemController.getAllFoodItems);                           // GET all food items
router.get('/getFoodItemsby/:id', foodItemController.getFoodItemById);                        // GET food item by ID
router.get('/getFoodItemBy/:name', foodItemController.getFoodItemByName);            // GET food item by name
router.post('/createFoodItem', validateFoodItem, foodItemController.createFoodItem);        // POST create food item
router.put('/updateFoodItemBy/:id', validateFoodItem, foodItemController.updateFoodItem);      // PUT update food item
router.delete('/deleteFoodItemBy/:id', foodItemController.deleteFoodItem);                      // DELETE food item
router.post('/add-to-meal/:meal_id', foodItemController.addFoodToMeal);       // POST food item to a meal
router.delete('/remove-from-meal/:meal_id/food-items/:id', foodItemController.removeFoodItemFromMeal);
router.put('/update-meal-item/:meal_id/food-items/:id', foodItemController.updateFoodItemQuantity);

module.exports = router;
