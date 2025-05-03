import React, { useEffect, useState } from 'react';
import { getMealById, deleteMeal } from '../api/mealApi';
import styles from '../styles/RecipeCard.module.css';

const MealCard = ({ mealId }) => {
  const [meal, setMeal] = useState(null);
  const [status, setStatus] = useState('');
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const data = await getMealById(mealId);
        setMeal(data);
      } catch (err) {
        console.error('Failed to fetch meal:', err);
        setStatus('❌ Failed to load meal.');
      }
    };

    if (mealId) {
      fetchMeal();
    }
  }, [mealId]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this meal?');
    if (!confirmed) return;

    try {
      await deleteMeal(mealId);
      setDeleted(true);
      setStatus('✅ Meal deleted successfully.');
    } catch (error) {
      console.error('Error deleting meal:', error);
      setStatus('❌ Failed to delete meal.');
    }
  };

  if (deleted) return <p className={styles.status}>Meal deleted.</p>;
  if (status && !meal) return <p className={styles.status}>{status}</p>;
  if (!meal) return <p className={styles.status}>Loading meal...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{meal.meal_type?.toUpperCase()}</h2>

      <div className={styles.box}>
      <h3 className={styles.boxTitle}>Meal Time</h3>
        <p className={styles.title2}>
      {new Date(meal.meal_time).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
        </p>
        <p className={styles.title2}>
    {new Date(meal.meal_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
        </p>
        </div>
        <div className={styles.box}>
        <h3 className={styles.boxTitle}>Notes</h3>
        <p className={styles.listItem}> {meal.notes}</p>
        </div>

        <div className={styles.box}>
        <h3 className={styles.boxTitle}>Nutritional Info</h3>
        <div className={styles.nutritionGrid}>
        <p><strong>Calories:</strong> {meal.total_calories} kcal</p>
        <p><strong>Proteins:</strong> {meal.total_proteins} g</p>
        <p><strong>Fats:</strong> {meal.total_fats} g</p>
        <p><strong>Carbs:</strong> {meal.total_carbs} g</p>
        </div>
      </div>

      {meal.food_snapshot && meal.food_snapshot.length > 0 && (
      <div className={styles.box}>
          <h3 className={styles.boxTitle}>Food Items</h3>
        <ol className={styles.orderedList}>
            {meal.food_snapshot.map((item, i) => (
              <li key={i}>
                {item.name || `${item.food_name}`} – {item.quantity_in_grams}g
              </li>
            ))}
          </ol>
        </div>
      )}

      {meal.recipe_snapshot && (
      <div className={styles.box}>
          <h3 className={styles.boxTitle}>Recipes</h3>
          <p class ={styles.title2}><strong>{meal.recipe_snapshot.name}</strong></p>
          <ol className={styles.orderedList}>
            {meal.recipe_snapshot.ingredients.map((ingredient, i) => (
              <li key={i}>
                {ingredient.name || ` ${ingredient.food_name}`} – {ingredient.quantity_in_grams}g
              </li>
            ))}
          </ol>
        </div>
      )}

      <button onClick={handleDelete} className={styles.submitButton}>
        Delete Meal
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
};

export default MealCard;
