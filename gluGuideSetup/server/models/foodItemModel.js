const pool = require('../config/db');

const FoodItem = {
    async getAllFoodItems() {
      return queryDB('SELECT * FROM foods');
    },
  
    async getFoodItemByName(name) {
      const query = 'SELECT * FROM foods WHERE name = $1';
      return queryDB(query, [name], true);
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
  
    async logFoodItem(user_id, food_id, quantityInGrams, date, totalCalories, totalProteins, totalFats, totalCarbs) {
      const query = `
        INSERT INTO food_logs (
          user_id, food_id, quantity_in_grams, log_time,
          total_calories, total_proteins, total_fats, total_carbs
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`;
      return queryDB(query, [user_id, food_id, quantityInGrams, date, totalCalories, totalProteins, totalFats, totalCarbs], true);
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


