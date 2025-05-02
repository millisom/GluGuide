import React, { useEffect, useState } from 'react';
import { getRecipeById, deleteRecipe } from '../api/recipeApi';
import styles from '../styles/LogMealPage.module.css';

const RecipeCard = ({ recipeId }) => {
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(recipeId);
        setRecipe(data);
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
        setStatus('❌ Failed to load recipe.');
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmed) return;

    try {
      await deleteRecipe(recipeId);
      setStatus('✅ Recipe deleted successfully.');
      setRecipe(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setStatus('❌ Failed to delete recipe.');
    }
  };

  if (status && !recipe) {
    return <p className={styles.status}>{status}</p>;
  }

  if (!recipe) {
    return;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{recipe.name}</h2>

      <section className={styles.section}>
        <h3 className={styles.title}>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((ingredient, i) => (
            <li key={i}>
              {ingredient.name || `Food ID ${ingredient.food_id}`} – {ingredient.quantity_in_grams}g
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.title}>Instructions</h3>
        <ol>
          {recipe.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h3 className={styles.title}>Nutritional Info</h3>
        <p><strong>Calories:</strong> {recipe.total_calories} kcal</p>
        <p><strong>Proteins:</strong> {recipe.total_proteins} g</p>
        <p><strong>Fats:</strong> {recipe.total_fats} g</p>
        <p><strong>Carbs:</strong> {recipe.total_carbs} g</p>
      </section>

      <button onClick={handleDelete} className={styles.submitButton}>
        Delete Recipe
      </button>
    </div>
  );
};

export default RecipeCard;
