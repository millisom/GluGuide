const Recipe = require('../models/recipeModel');

// Controller for recipes
const recipeController = {
  
  // GET all recipes
  async getAllRecipes(req, res, next) {
    try {
      const recipes = await Recipe.getAllRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  },

  // GET a recipe by ID
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

  // GET a recipe by name (optional, depends if you need it)
  async getRecipeByName(req, res, next) {
    try {
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({ message: 'Recipe name is required' });
      }

      const recipe = await Recipe.getRecipeByName(name);

      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  },

  // POST create a new recipe
  async createRecipe(req, res, next) {
    try {
      const { user_id, name, ingredients, instructions } = req.body;
      const created_at = new Date(); // Current time

      if (!user_id || !name || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newRecipe = await Recipe.addRecipe(user_id, name, ingredients, instructions, created_at);
      res.status(201).json(newRecipe);
    } catch (error) {
      next(error);
    }
  },

  // PUT update existing recipe
  async updateRecipe(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { name, ingredients, instructions } = req.body;
      const updated_at = new Date();

      const updatedRecipe = await Recipe.updateRecipe(id, name, ingredients, instructions, updated_at);

      if (!updatedRecipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      res.status(200).json(updatedRecipe);
    } catch (error) {
      next(error);
    }
  },

  // DELETE a recipe
  async deleteRecipe(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const user_id = req.body.user_id;

        if (!user_id) {
            return res.status(400).json({ message: 'user_id is required to delete recipe.' });
        }

        const deletedRecipe = await Recipe.deleteRecipe(id, user_id);

        if (!deletedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json({ message: 'Recipe deleted successfully', recipe: deletedRecipe });

    } catch (error) {
        next(error);
    }
},

  async logRecipe(req, res, next) {
    try {
      const { recipe_id, user_id, action } = req.body;
      const timestamp = new Date(); // Current time

      if (!recipe_id || !user_id || !action) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const loggedRecipe = await Recipe.logRecipe(recipe_id, user_id, action, timestamp);
      res.status(201).json(loggedRecipe);
    } catch (error) {
      next(error);
    }
  }

};

module.exports = recipeController;
