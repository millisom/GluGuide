const express = require('express');
const router = express.Router();
const foodItemController = require('../controllers/foodItemController');
const { validateFoodItem } = require('../middleware/validationMiddleware');

// Routes for Food Items
router.get('/food-items', foodItemController.getAllFoodItems);             // GET all food items
router.get('/food-items/:id', foodItemController.getFoodItemById);         // GET food item by ID
router.get('/food-items/search/:name', foodItemController.getFoodItemByName);    // GET food item by name
router.post('/food-items', validateFoodItem, foodItemController.createFoodItem); // POST create food item
router.put('/food-items/:id', validateFoodItem, foodItemController.updateFoodItem); // PUT update food item
router.delete('/food-items/:id', foodItemController.deleteFoodItem);       // DELETE food item
router.post('/search/:name/log', foodItemController.searchAndLogFoodItem); // GET food item by name and log it


module.exports = router;
