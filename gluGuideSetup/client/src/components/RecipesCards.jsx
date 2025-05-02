import React, { useEffect, useState } from 'react';
import { getAllRecipes } from '../api/recipeApi';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LogMealPage.module.css';

const RecipesCards = () => {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setStatus('❌ Failed to load recipes.');
      }
    };

    fetchRecipes();
  }, []);

  if (status) return <p className={styles.status}>{status}</p>;
  if (recipes.length === 0) return <p className={styles.status}>No recipes found.</p>;

  return (
    <div>
      <h2 className={styles.title}>All Recipes</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className={styles.container} style={{ width: '300px' }}>
            <h3 className={styles.title}>{recipe.name}</h3>
            <div>
              <p><strong>Calories:</strong> {recipe.total_calories} kcal</p>
            </div>
            <button
              className={styles.submitButton}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              View Recipe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesCards;
