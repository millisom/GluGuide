import React, { useEffect, useState } from 'react';
import { getAllRecipes } from '../api/recipeApi';
import styles from '../styles/RecipeSelector.module.css';

const RecipeSelector = ({ onSelect }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Failed to load recipes', error);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <select onChange={(e) => onSelect(recipes.find(r => r.id === parseInt(e.target.value)))} className={styles.dropdown}>
      <option value="">Select a Recipe (optional)</option>
      {recipes.map((recipe) => (
        <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
      ))}
    </select>
  );
};

export default RecipeSelector;