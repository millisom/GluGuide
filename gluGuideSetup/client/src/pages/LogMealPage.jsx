import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodItemInput from '../components/FoodItemInput';
import RecipeSelector from '../components/RecipeSelector';
import MealPreview from '../components/MealPreview';
import { createMeal, recalculateMealNutrition } from '../api/mealApi';
import styles from '../styles/LogMealPage.module.css';

const LogMealPage = () => {
  const [mealType, setMealType] = useState('');
  const [notes, setNotes] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [status, setStatus] = useState('');
  const navigate = useNavigate(); // 🔁 import navigation

  const addFoodItem = (item) => {
    setFoodItems((prev) => [...prev, item]);
  };

  const removeFoodItem = (index) => {
    setFoodItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!mealType) return setStatus('Please select a meal type');

    try {
      const payload = {
        meal_type: mealType,
        meal_time: new Date().toISOString(),
        notes,
        foodItems,
        recipe_id: selectedRecipe?.id || null,
      };

      const meal = await createMeal(payload);

      await recalculateMealNutrition(meal.meal_id); // Recalculate macros

      setStatus('Meal saved and macros calculated!');
      setMealType('');
      setNotes('');
      setFoodItems([]);
      setSelectedRecipe(null);

      navigate(`/meals/${meal.meal_id}`); // 👈 Redirect to MealCard
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      setStatus('Error saving meal');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Log Your Meal</h1>
      <select
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
        className={styles.input}
      >
        <option value="">Select Meal Type</option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
      </select>

      <textarea
        value={notes}
        placeholder="Notes"
        onChange={(e) => setNotes(e.target.value)}
        className={styles.textarea}
      />

      <RecipeSelector onSelect={setSelectedRecipe} />
      <FoodItemInput onAdd={addFoodItem} />

      {(foodItems.length > 0 || selectedRecipe) && (
        <MealPreview
          items={foodItems}
          selectedRecipe={selectedRecipe}
          onRemove={removeFoodItem}
          onEdit={() => {}}
          onEditRecipe={() => {}}
          onRemoveRecipe={() => setSelectedRecipe(null)}
        />
      )}

      <button onClick={handleSubmit} className={styles.submitButton}>
        Save Meal
      </button>
      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
};

export default LogMealPage;
