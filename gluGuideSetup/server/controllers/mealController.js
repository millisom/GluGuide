const Meal = require('../models/mealModel');
const Recipe = require('../models/recipeModel');

const mealController = {
  // ✅ Create meal with optional recipe and food snapshot
  async createMeal(req, res, next) {
    try {
      const { meal_type, meal_time, notes, foodItems = [], recipe_id = null } = req.body;
      const user_id = req.session.userId;

      if (!user_id || !meal_type) {
        return res.status(400).json({ message: 'user_id and meal_type are required' });
      }

      let combinedItems = [...foodItems];
      let recipeSnapshot = null;

      // ✅ If recipe is selected, fetch and merge its ingredients
      if (recipe_id) {
        const recipe = await Recipe.getRecipeById(recipe_id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        recipeSnapshot = recipe;

        if (Array.isArray(recipe.ingredients)) {
          combinedItems = [...combinedItems, ...recipe.ingredients];
        }
      }

      // ✅ Create the meal with JSONB snapshots
      const meal = await Meal.createMeal(
        user_id,
        meal_type,
        meal_time,
        notes,
        recipe_id,
        combinedItems,
        recipeSnapshot
      );

      // ✅ Link each food item in the `meal_food_items` table
      for (const item of combinedItems) {
        await Meal.addFoodToMeal(meal.meal_id, item.food_id, item.quantity_in_grams || 100);
      }

      // ✅ Calculate and store total nutrition
      const updatedMeal = await Meal.updateMealNutrition(meal.meal_id);

      res.status(201).json(updatedMeal);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Get meal by ID including its food items
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

  // ✅ Get all meals for a user from session
  async getMealsByUser(req, res, next) {
    try {
      const user_id = req.session.userId;
      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required in session' });
      }

      const meals = await Meal.getMealsByUser(user_id);
      res.status(200).json(meals);
    } catch (error) {
      next(error);
    }
  },

  // ✅ Recalculate and update nutrition totals for a meal
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
