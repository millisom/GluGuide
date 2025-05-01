const Recipe = require('../models/recipeModel');
const calculateTotalNutrition = require('../helpers/nutritionHelper');

const recipeController = {
  
  async getAllRecipes(req, res, next) {
    try {
      const recipes = await Recipe.getAllRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  },

  async getRecipeById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const recipe = await Recipe.getRecipeById(id);

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  },

  async getRecipeByName(req, res, next) {
    try {
      const name = req.query.name?.toLowerCase();
  
      if (!name) {
        return res.status(400).json({ message: 'Recipe name is required' });
      }
  
      const recipes = await Recipe.getRecipeByName(name); // can return multiple
  
      if (!recipes || recipes.length === 0) {
        return res.status(404).json({ message: 'No recipes found' });
      }
  
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  },  
 
  async createRecipe(req, res, next) {
    try {
      const { name, ingredients, instructions } = req.body;
      const user_id = req.session.userId;
      const created_at = new Date();

      if (!user_id || !name || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const totalNutrition = await calculateTotalNutrition(ingredients);
      const newRecipe = await Recipe.createRecipe(user_id, name, ingredients, instructions, created_at, totalNutrition);

      res.status(201).json(newRecipe);
    } catch (error) {
      if (error.message.includes('Food item')) {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },
  async updateRecipe(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { name, ingredients, instructions } = req.body;
      const updated_at = new Date();

      const totalNutrition = await calculateTotalNutrition(ingredients);
      const updatedRecipe = await Recipe.updateRecipe(id, name, ingredients, instructions, updated_at, totalNutrition);

      if (!updatedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.status(200).json(updatedRecipe);
    } catch (error) {
      if (error.message.includes('Food item')) {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },
  async deleteRecipe(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const deletedRecipe = await Recipe.deleteRecipe(id);

      if (!deletedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      next(error);
    }
  },
  
  async logRecipe(req, res, next) {
    try {
      const { recipe_id, action } = req.body;
      const user_id = req.session.userId;
      const timestamp = new Date();

      if (!recipe_id || !user_id || !action) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const ingredients = await Recipe.getRecipeIngredients(recipe_id);
      if (!ingredients || ingredients.length === 0) {
        return res.status(404).json({ message: 'Recipe ingredients not found' });
      }

      const totalNutrition = await calculateTotalNutrition(ingredients);

      const loggedRecipe = await Recipe.logRecipe(user_id, recipe_id, action, timestamp, totalNutrition);
      if (!loggedRecipe) {
        return res.status(500).json({ message: 'Failed to log recipe' });
      }

      res.status(201).json(loggedRecipe);
    } catch (error) {
      next(error);
    }
  },

  async getRecipeLogs(req, res, next) {
    try {
      const user_id = req.session.userId;
  
      if (!user_id) {
        return res.status(400).json({ message: 'User ID is required in URL' });
      }
  
      const logs = await Recipe.getRecipeLogs(user_id);
      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  },  

  async deleteRecipeLog(req, res, next) {
    try {
      const id = parseInt(req.params.id);
  
      if (!id) {
        return res.status(400).json({ message: 'Log ID is required in URL' });
      }
  
      const deletedLog = await Recipe.deleteRecipeLog(id);
      if (!deletedLog) {
        return res.status(404).json({ message: 'Log not found' });
      }
  
      res.status(200).json({ message: 'Log deleted successfully', deletedLog });
    } catch (error) {
      next(error);
    }
  }
  

};

module.exports = recipeController;
