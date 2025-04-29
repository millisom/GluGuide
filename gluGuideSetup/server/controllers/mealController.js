const Meal = require('../models/mealModel');

const mealController = {
  async createMeal(req, res, next) {
    try {
      const { user_id, meal_type, meal_time, notes } = req.body;

      if (!user_id || !meal_type) {
        return res.status(400).json({ message: 'user_id and meal_type are required' });
      }

      const meal = await Meal.createMeal(user_id, meal_type, meal_time, notes);
      res.status(201).json(meal);
    } catch (error) {
      next(error);
    }
  },

  async getMealById(req, res, next) {
    try {
      const meal_id = parseInt(req.params.id);
      const meal = await Meal.getMealById(meal_id);
      if (!meal) {
        return res.status(404).json({ message: 'Meal not found' });
      }

      const items = await Meal.getMealFoodItems(meal_id);
      res.status(200).json({ ...meal, items });
    } catch (error) {
      next(error);
    }
  },

  async getMealsByUser(req, res, next) {
    try {
      const { user_id } = req.body;
      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required in body' });
      }

      const meals = await Meal.getMealsByUser(user_id);
      res.status(200).json(meals);
    } catch (error) {
      next(error);
    }
  },

  async updateMealNutrition(req, res, next) {
    try {
      const meal_id = parseInt(req.params.id);
      const updatedMeal = await Meal.updateMealNutrition(meal_id);
      res.status(200).json(updatedMeal);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = mealController;
