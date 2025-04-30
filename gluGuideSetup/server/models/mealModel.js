const pool = require('../config/db');
const calculateTotalNutrition = require('../helpers/nutritionHelper');

const Meal = {
  // ✅ Create meal with optional recipe and snapshot support
  async createMeal(user_id, meal_type, meal_time, notes, recipe_id = null, food_snapshot = null, recipe_snapshot = null) {
    const query = `
      INSERT INTO meals (
        user_id,
        meal_type,
        meal_time,
        notes,
        recipe_id,
        food_snapshot,
        recipe_snapshot
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

    const values = [
      user_id,
      meal_type,
      meal_time || new Date(),
      notes || null,
      recipe_id,
      food_snapshot ? JSON.stringify(food_snapshot) : null,
      recipe_snapshot ? JSON.stringify(recipe_snapshot) : null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // ✅ Fetch one meal
  async getMealById(meal_id) {
    const query = 'SELECT * FROM meals WHERE meal_id = $1';
    const result = await pool.query(query, [meal_id]);
    return result.rows[0];
  },

  // ✅ Fetch all meals for a user
  async getMealsByUser(user_id) {
    const query = 'SELECT * FROM meals WHERE user_id = $1 ORDER BY meal_time DESC';
    const result = await pool.query(query, [user_id]);
    return result.rows;
  },

  // ✅ Fetch all food items linked to a meal
  async getMealFoodItems(meal_id) {
    const query = `
      SELECT f.*, mfi.quantity_in_grams
      FROM meal_food_items mfi
      JOIN foods f ON f.food_id = mfi.food_id
      WHERE mfi.meal_id = $1`;
    const result = await pool.query(query, [meal_id]);
    return result.rows;
  },

  // ✅ Calculate and update total macros for a meal
  async updateMealNutrition(meal_id) {
    const items = await Meal.getMealFoodItems(meal_id);
    const nutrition = await calculateTotalNutrition(items);

    const query = `
      UPDATE meals SET
        total_calories = $1,
        total_proteins = $2,
        total_fats = $3,
        total_carbs = $4
      WHERE meal_id = $5
      RETURNING *`;

    const values = [
      nutrition.totalCalories,
      nutrition.totalProteins,
      nutrition.totalFats,
      nutrition.totalCarbs,
      meal_id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // ✅ Add a food item to a meal (meal_food_items table)
  async addFoodToMeal(meal_id, food_id, quantity_in_grams) {
    const query = `
      INSERT INTO meal_food_items (meal_id, food_id, quantity_in_grams)
      VALUES ($1, $2, $3)`;
    const values = [meal_id, food_id, quantity_in_grams];
    await pool.query(query, values);
  }
};

module.exports = Meal;
