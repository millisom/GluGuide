import React, { useState, useEffect } from 'react';
import SearchFoodItem from './SearchFoodItem';
import IngredientList from './IngedientsList';
import RecipeInstructionsInput from './RecipeInstructionsInput';
import { createRecipe } from '../api/recipeApi';
import styles from '../styles/LogMealPage.module.css';


const RecipeDashboard = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [status, setStatus] = useState('');

  const addIngredient = (item) => {
    setIngredients((prev) => [...prev, item]);
  };

  const removeIngredient = (index) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateInstructions = (newInstructions) => {
    setInstructions(newInstructions);
  };

  const handleSubmit = async () => {
    if (!recipeName.trim()) return setStatus('Please enter a recipe name');
    if (ingredients.length === 0) return setStatus('Please add at least one ingredient');
    if (instructions.length === 0) return setStatus('Please add instructions');

    try {
      const payload = {
        user_id: 1, 
        name: recipeName,
        ingredients,
        instructions,
      };

      console.log('Creating recipe:', payload);
      await createRecipe(payload);

      setStatus('Recipe created successfully!');
      setRecipeName('');
      setIngredients([]);
      setInstructions([]);
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      setStatus('Failed to create recipe');
    }
  };

  return (
    <>
      <h1 className={styles.title}>Create Your Recipe</h1>

      <input
        type="text"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        placeholder="Recipe Name"
        className={styles.input}
      />
      <SearchFoodItem onAdd={addIngredient} />

      {ingredients.length > 0 && (
        <IngredientList ingredients={ingredients} onRemove={removeIngredient} />
      )}

      <RecipeInstructionsInput
        instructions={instructions}
        setInstructions={updateInstructions}
      />

      <button onClick={handleSubmit} className={styles.submitButton}>
        Save Recipe
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </>
  );
};

export default RecipeDashboard;
