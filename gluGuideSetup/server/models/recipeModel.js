const pool = require('../config/db');
const calculateTotalNutrition = require('../helpers/nutritionHelper');

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

    async createRecipe(user_id, name, ingredients, instructions, created_at) {
        const totalNutrition = await calculateTotalNutrition(ingredients);


        const ingredientsValue = JSON.stringify(Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients));
        const instructionsValue = JSON.stringify(Array.isArray(instructions) ? instructions : JSON.parse(instructions));
        

        const query = `
            INSERT INTO recipes (user_id, name, ingredients, instructions, created_at, total_calories, total_proteins, total_fats, total_carbs)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`;

            const values = [
                user_id,
                name,
                ingredientsValue,
                instructionsValue,
                created_at,
                totalNutrition.totalCalories,
                totalNutrition.totalProteins,
                totalNutrition.totalFats,
                totalNutrition.totalCarbs
              ];

              const result = await pool.query(query, values);
              return result.rows[0];
            },
          
    async updateRecipe(id, name, ingredients, instructions, updated_at) {
        const totalNutrition = await calculateTotalNutrition(ingredients);

        const ingredientsValue = JSON.stringify(Array.isArray(ingredients) ? ingredients : JSON.parse(ingredients));
        const instructionsValue = JSON.stringify(Array.isArray(instructions) ? instructions : JSON.parse(instructions));

        const query = `
      UPDATE recipes 
      SET name = $1, 
          ingredients = $2::jsonb, 
          instructions = $3::jsonb, 
          updated_at = $4,
          total_calories = $5,
          total_proteins = $6,
          total_fats = $7,
          total_carbs = $8
      WHERE id = $9
      RETURNING *`;

    const values = [
      name,
      ingredientsValue,
      instructionsValue,
      updated_at,
      totalNutrition.totalCalories,
      totalNutrition.totalProteins,
      totalNutrition.totalFats,
      totalNutrition.totalCarbs,
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
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

    async logRecipe(user_id, recipe_id, action, timestamp, totalNutrition) {
        const query = `
          INSERT INTO recipe_logs 
            (user_id, recipe_id, action, timestamp, total_calories, total_proteins, total_fats, total_carbs)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *`;
    
        const values = [
          user_id,
          recipe_id,
          action,
          timestamp,
          totalNutrition.totalCalories,
          totalNutrition.totalProteins,
          totalNutrition.totalFats,
          totalNutrition.totalCarbs
        ];
    
        const result = await pool.query(query, values);
        return result.rows[0];
      },

      async getRecipeIngredients(recipe_id) {
        const query = 'SELECT ingredients FROM recipes WHERE id = $1';
        const values = [recipe_id];
      
        try {
          const result = await pool.query(query, values);
          if (result.rows.length === 0) return null;
          return result.rows[0].ingredients;
        } catch (error) {
          throw error;
        }
      },

        async getRecipeLogs(user_id) {
            const query = 'SELECT * FROM recipe_logs WHERE user_id = $1';
            const values = [user_id];
        
            try {
                const result = await pool.query(query, values);
                return result.rows;
            } catch (error) {
                throw error;
            }
        },

        async deleteRecipeLog(id) {
            const query = 'DELETE FROM recipe_logs WHERE id = $1 RETURNING *';
            const values = [id];
        
            try {
                const result = await pool.query(query, values);
                return result.rows[0];
            } catch (error) {
                throw error;
            }
        }
      
    };

module.exports = Recipe;


