const pool = require('../config/db');
const calculateTotalNutrition = require('../helpers/nutritionHelper');

const Meal = {
  async createMeal(user_id, meal_type, meal_time, notes) {
    const query = `
      INSERT INTO meals (user_id, meal_type, meal_time, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const values = [user_id, meal_type, meal_time || new Date(), notes || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getMealById(meal_id) {
    const query = 'SELECT * FROM meals WHERE meal_id = $1';
    const result = await pool.query(query, [meal_id]);
    return result.rows[0];
  },

  async getMealsByUser(user_id) {
    const query = 'SELECT * FROM meals WHERE user_id = $1 ORDER BY meal_time DESC';
    const result = await pool.query(query, [user_id]);
    return result.rows;
  },

  async getMealFoodItems(meal_id) {
    const query = `
      SELECT f.*, mfi.quantity_in_grams
      FROM meal_food_items mfi
      JOIN foods f ON f.food_id = mfi.food_id
      WHERE mfi.meal_id = $1`;
    const result = await pool.query(query, [meal_id]);
    return result.rows;
  },

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
  }
};

module.exports = Meal;
