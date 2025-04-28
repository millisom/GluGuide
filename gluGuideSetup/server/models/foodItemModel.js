const { log } = require('console');
const pool = require('../config/db');
const { search } = require('../routes/foodItemRoutes');
const { get } = require('http');

const FoodItem = {
    async getAllFoodItems() {
        const query = 'SELECT * FROM foods';
    
        try {
        const result = await pool.query(query);
        return result.rows;
        } catch (error) {
        throw error;
        }
    },

    async getFoodItemByName(name) {
        const query = 'SELECT * FROM foods WHERE name = $1';
        const values = [name];
    
        try {
        const result = await pool.query(query, values);
        return result.rows[0];
        } catch (error) {
        throw error;
        }
    },
    
    async getFoodItemById(id) {
        const query = 'SELECT * FROM foods WHERE food_id = $1';
        const values = [id];
    
        try {
        const result = await pool.query(query, values);
        return result.rows[0];
        } catch (error) {
        throw error;
        }
    },

    async createFoodItem(name, cal, carbs, proteins, fats) {
        const query = 'INSERT INTO foods (name, calories, carbs, proteins, fats) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [name, cal, carbs, proteins, fats];
    
        try {
        const result = await pool.query(query, values);
        return result.rows[0];
        } catch (error) {
        throw error;
        }
    },

    async updateFoodItem(food_id, name, cal, carbs, proteins, fats) {
        const query = 'UPDATE foods SET name = $1, calories = $2, carbs = $3, proteins = $4, fats = $5 WHERE food_id = $6 RETURNING *';
        const values = [name, cal, carbs, proteins, fats, food_id];
    
        try {
        const result = await pool.query(query, values);
        return result.rows[0];
        } catch (error) {
        throw error;
        }
    },

    async deleteFoodItem(id) {
        const query = 'DELETE FROM foods WHERE food_id = $1 RETURNING *';
        const values = [id];
    
        try {
        const result = await pool.query(query, values);
        return result.rows[0];
        } catch (error) {
        throw error;
        }
    },

    async logFoodItem (user_id, food_id, quantity, date) {
        const query = 'INSERT INTO food_logs (user_id, food_id, quantity, log_time) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [user_id, food_id, quantity, date];
    
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

};

module.exports = FoodItem;


