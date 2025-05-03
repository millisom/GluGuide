const FoodItem = require('../models/foodItemModel');

async function calculateTotalNutrition(ingredients) {
  let totalCalories = 0;
  let totalProteins = 0;
  let totalFats = 0;
  let totalCarbs = 0;

  for (const ingredient of ingredients) {
    const foodItem = await FoodItem.getFoodItemById(ingredient.food_id);
    if (!foodItem) {
      throw new Error(`Food item with ID ${ingredient.food_id} not found.`);
    }

    const quantity = ingredient.quantity_in_grams || ingredient.quantityInGrams || 100;

    totalCalories += (foodItem.calories / 100) * quantity;
    totalProteins += (foodItem.proteins / 100) * quantity;
    totalFats += (foodItem.fats / 100) * quantity;
    totalCarbs += (foodItem.carbs / 100) * quantity;
  }

  return {
    totalCalories,
    totalProteins,
    totalFats,
    totalCarbs
  };
}

module.exports = calculateTotalNutrition;
