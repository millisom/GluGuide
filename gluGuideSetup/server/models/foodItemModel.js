const pool = require('../config/db');

const FoodItem = {
  async getAllFoodItems() {
    return queryDB('SELECT * FROM foods');
  },

  async getFoodItemByName(name) {
    const query = 'SELECT * FROM foods WHERE name ILIKE $1';
    return queryDB(query, [`%${name}%`]);
  },

  async getFoodItemById(id) {
    const query = 'SELECT * FROM foods WHERE food_id = $1';
    return queryDB(query, [id], true);
  },

  async createFoodItem(name, cal, carbs, proteins, fats) {
    const query = `
      INSERT INTO foods (name, calories, carbs, proteins, fats)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    return queryDB(query, [name, cal, carbs, proteins, fats], true);
  },

  async updateFoodItem(food_id, name, cal, carbs, proteins, fats) {
    const query = `
      UPDATE foods
      SET name = $1, calories = $2, carbs = $3, proteins = $4, fats = $5
      WHERE food_id = $6
      RETURNING *`;
    return queryDB(query, [name, cal, carbs, proteins, fats, food_id], true);
  },

  async deleteFoodItem(id) {
    const query = 'DELETE FROM foods WHERE food_id = $1 RETURNING *';
    return queryDB(query, [id], true);
  },

  async addFoodToMeal(meal_id, food_id, quantityInGrams) {
    const query = `
      INSERT INTO meal_food_items (meal_id, food_id, quantity_in_grams)
      VALUES ($1, $2, $3)
      RETURNING *`;
    return queryDB(query, [meal_id, food_id, quantityInGrams], true);
  },
  async removeFoodItemFromMeal(id) {
    const query = 'DELETE FROM meal_food_items WHERE id = $1 RETURNING *';
    return queryDB(query, [id], true);
  },
  async updateMealFoodItemQuantity(id, quantity) {
    const query = `
      UPDATE meal_food_items
      SET quantity_in_grams = $1
      WHERE id = $2
      RETURNING *`;
    return queryDB(query, [quantity, id], true);
  }
  
};

async function queryDB(query, values = [], single = false) {
  try {
    const result = await pool.query(query, values);
    return single ? result.rows[0] : result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = FoodItem;
