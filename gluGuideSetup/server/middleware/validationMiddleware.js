
// Validate creating or updating a FoodItem
function validateFoodItem(req, res, next) {
    const { name, calories, carbs, proteins, fats } = req.body;

    if (!name || calories == null || carbs == null || proteins == null || fats == null) {
        return res.status(400).json({ 
            message: 'Missing required fields for FoodItem: name, calories, carbs, proteins, fats are all required.' 
        });
    }

    if (typeof calories !== 'number' || typeof carbs !== 'number' || typeof proteins !== 'number' || typeof fats !== 'number') {
        return res.status(400).json({ 
            message: 'Calories, carbs, proteins, and fats must be numbers.' 
        });
    }

    next();
}

// Validate creating or updating a Recipe
function validateRecipe(req, res, next) {
    const { user_id, name, ingredients, instructions } = req.body;

    if (!user_id || !name || !ingredients || !instructions) {
        return res.status(400).json({ 
            message: 'Missing required fields for Recipe: user_id, name, ingredients, instructions are all required.' 
        });
    }

    // Validate ingredients
    if (!Array.isArray(ingredients) && typeof ingredients !== 'string') {
        return res.status(400).json({
            message: 'Ingredients must be either an array or a stringified JSON array.'
        });
    }

    next();
}


module.exports = {
    validateFoodItem,
    validateRecipe,
};
