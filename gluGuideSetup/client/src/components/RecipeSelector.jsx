import React, { useEffect, useState } from 'react';
import { getAllRecipes, getRecipeById } from '../api/recipeApi';
import styles from '../styles/RecipeSelector.module.css';

const RecipeSelector = ({ onSelect }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes(); // only id + name
        setRecipes(data);
      } catch (error) {
        console.error('Failed to load recipes', error);
      }
    };
    fetchRecipes();
  }, []);

  const handleChange = async (e) => {
    const selectedId = e.target.value;
    if (selectedId === '') {
      onSelect(null); // clear selection
    } else {
      try {
        const fullRecipe = await getRecipeById(parseInt(selectedId)); // ✅ fetch full details
        onSelect(fullRecipe);
      } catch (error) {
        console.error('Failed to load recipe details', error);
        onSelect(null);
      }
    }
  };

  return (
    <select onChange={handleChange} className={styles.dropdown}>
      <option value="">Select a Recipe (optional)</option>
      {recipes.map((recipe) => (
        <option key={recipe.id} value={recipe.id}>
          {recipe.name}
        </option>
      ))}
    </select>
  );
};

export default RecipeSelector;
