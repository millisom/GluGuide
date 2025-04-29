const FoodItem = require('../models/foodItemModel');
const calculateSingleFoodItemNutrition = require('../helpers/singleFoodItemNutritionHelper');

// Controller for food items
const foodItemController = {
  
  // GET all food items
  async getAllFoodItems(req, res, next) {
    try {
      const foodItems = await FoodItem.getAllFoodItems();
      res.status(200).json(foodItems);
    } catch (error) {
      next(error); // Passes error to error middleware
    }
  },

  // GET a food item by ID
  async getFoodItemById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const foodItem = await FoodItem.getFoodItemById(id);

      if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }

      res.status(200).json(foodItem);
    } catch (error) {
      next(error);
    }
  },
  async getFoodItemByName(req, res, next) {
    try {
      const name = req.params.name;
      const foodItem = await FoodItem.getFoodItemByName(name);

      if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }

      res.status(200).json(foodItem);
    } catch (error) {
      next(error);
    }
  },

  // POST create new food item
  async createFoodItem(req, res, next) {
    try {
      const { name, calories, carbs, proteins, fats } = req.body;

      if (!name || calories == null || carbs == null || proteins == null || fats == null) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newFoodItem = await FoodItem.createFoodItem(name, calories, carbs, proteins, fats);
      res.status(201).json(newFoodItem);
    } catch (error) {
      next(error);
    }
  },
  // PUT update food item
  async updateFoodItem(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { name, calories, carbs, proteins, fats } = req.body;

      const updatedFoodItem = await FoodItem.updateFoodItem(id, name, calories, carbs, proteins, fats);

      if (!updatedFoodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }

      res.status(200).json(updatedFoodItem);
    } catch (error) {
      next(error);
    }
  },

  // DELETE a food item
  async deleteFoodItem(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const deletedFoodItem = await FoodItem.deleteFoodItem(id);

      if (!deletedFoodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }

      res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

    // GET food item by name and log it
    async searchAndLogFoodItem(req, res, next) {
      try {
        const name = req.params.name;
        const user_id = req.user.id; // Assuming user ID is available in req.user
        if (!user_id) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        const quantityInGrams = req.body.quantityInGrams || 100;
        const date = new Date();
  
        const foodItem = await FoodItem.getFoodItemByName(name);
        if (!foodItem) {
          return res.status(404).json({ message: 'Food item not found' });
        }
  
        const nutrition = calculateSingleFoodItemNutrition(foodItem, quantityInGrams);
  
        const loggedFoodItem = await FoodItem.logFoodItem(
          user_id,
          foodItem.food_id,
          quantityInGrams,
          date,
          nutrition.totalCalories,
          nutrition.totalProteins,
          nutrition.totalFats,
          nutrition.totalCarbs
        );
  
        res.status(200).json(loggedFoodItem);
      } catch (error) {
        next(error);
      }
    }
  
};

module.exports = foodItemController;
