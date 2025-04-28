const { log } = require('console');
const pool = require('../config/db');

const Recipe = {
    async getAllRecipes() {
        const query = 'SELECT * FROM recipes';
    
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    async getRecipeById(id) {
        const query = 'SELECT * FROM recipes WHERE id = $1';
        const values = [id];
    
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
    async getRecipeByName(name) {
        const query = 'SELECT * FROM recipes WHERE name = $1';
        const values = [name];
    
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    async addRecipe(user_id, name, ingredients, instructions, created_at) {
        const query = `
            INSERT INTO recipes (user_id, name, ingredients, instructions, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;

        // 🛠 Prepare ingredients
        let ingredientsValue;
        if (typeof ingredients === 'string') {
            try {
                ingredientsValue = JSON.stringify(JSON.parse(ingredients));
            } catch (error) {
                throw new Error('Invalid JSON format for ingredients.');
            }
        } else if (Array.isArray(ingredients)) {
            ingredientsValue = JSON.stringify(ingredients);
        } else {
            throw new Error('Ingredients must be an array or a JSON string.');
        }

        // 🛠 Prepare instructions
        let instructionsValue;
        if (typeof instructions === 'string') {
            try {
                instructionsValue = JSON.stringify(JSON.parse(instructions));
            } catch (error) {
                throw new Error('Invalid JSON format for instructions.');
            }
        } else if (Array.isArray(instructions)) {
            instructionsValue = JSON.stringify(instructions);
        } else {
            throw new Error('Instructions must be an array or a JSON string.');
        }

        const values = [user_id, name, ingredientsValue, instructionsValue, created_at];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
    async updateRecipe(id, name, ingredients, instructions, updated_at) {
        const query = `
            UPDATE recipes 
            SET name = $1, 
                ingredients = $2::jsonb, 
                instructions = $3::jsonb, 
                updated_at = $4
            WHERE id = $5
            RETURNING *`;
    
        let ingredientsValue;
        if (typeof ingredients === 'string') {
            try {
                ingredientsValue = JSON.stringify(JSON.parse(ingredients));
            } catch (error) {
                throw new Error('Invalid JSON format for ingredients.');
            }
        } else if (Array.isArray(ingredients)) {
            ingredientsValue = JSON.stringify(ingredients);
        } else {
            throw new Error('Ingredients must be an array or JSON string.');
        }
    
        let instructionsValue;
        if (typeof instructions === 'string') {
            try {
                instructionsValue = JSON.stringify(JSON.parse(instructions));
            } catch (error) {
                throw new Error('Invalid JSON format for instructions.');
            }
        } else if (Array.isArray(instructions)) {
            instructionsValue = JSON.stringify(instructions);
        } else {
            throw new Error('Instructions must be an array or JSON string.');
        }
    
        const values = [name, ingredientsValue, instructionsValue, updated_at, id];
    
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },    

    async deleteRecipe(id) {
        const query = 'DELETE FROM recipes WHERE id = $1 RETURNING *';
        const values = [id];
    
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
    async logRecipe(recipe_id, user_id, action, timestamp) {
        const query = 'INSERT INTO recipe_logs (recipe_id, user_id, action, timestamp) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [recipe_id, user_id, action, timestamp];
    
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Recipe;


