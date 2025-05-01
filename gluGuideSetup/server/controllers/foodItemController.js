const FoodItem = require('../models/foodItemModel');
const Meal = require('../models/mealModel');

const foodItemController = {

  async getAllFoodItems(req, res, next) {
    try {
      const foodItems = await FoodItem.getAllFoodItems();
      res.status(200).json(foodItems);
    } catch (error) {
      next(error);
    }
  },

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
      const name = req.params.name.toLowerCase();
      const foodItem = await FoodItem.getFoodItemByName(name);
      if (!foodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }
      res.status(200).json(foodItem);
    } catch (error) {
      next(error);
    }
  },

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

  async addFoodToMeal(req, res, next) {
    try {
      const { meal_id } = req.params;
      const { food_id, quantityInGrams } = req.body;

      if (!food_id || !quantityInGrams) {
        return res.status(400).json({ message: 'food_id and quantityInGrams are required' });
      }

      const addedItem = await FoodItem.addFoodToMeal(meal_id, food_id, quantityInGrams);
      res.status(201).json(addedItem);
    } catch (error) {
      next(error);
    }
  },

  async removeFoodItemFromMeal(req, res, next) {
    try {
      const { meal_id, id } = req.params;
  
      const deleted = await FoodItem.removeFoodItemFromMeal(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Food item not found in meal' });
      }
  
      await Meal.updateMealNutrition(meal_id);
      res.status(200).json({ message: 'Food item removed from meal' });
    } catch (error) {
      next(error);
    }
  },
  
  async updateFoodItemQuantity(req, res, next) {
    try {
      const { meal_id, id } = req.params;
      const { quantityInGrams } = req.body;
  
      const updated = await FoodItem.updateMealFoodItemQuantity(id, quantityInGrams);
      if (!updated) {
        return res.status(404).json({ message: 'Food item not found in meal' });
      }
  
      await Meal.updateMealNutrition(meal_id);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  },  

};

module.exports = foodItemController;
