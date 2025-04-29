function calculateSingleFoodItemNutrition(foodItem, quantityInGrams = 100) {
    return {
      totalCalories: (foodItem.calories / 100) * quantityInGrams,
      totalProteins: (foodItem.proteins / 100) * quantityInGrams,
      totalFats: (foodItem.fats / 100) * quantityInGrams,
      totalCarbs: (foodItem.carbs / 100) * quantityInGrams
    };
  }
  
  module.exports = calculateSingleFoodItemNutrition;
  