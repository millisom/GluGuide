import React from 'react';
import styles from '../styles/RecipeItem.module.css';

const RecipeItem = ({ recipe, onAdd }) => {
  const handleAdd = () => {
    const recipeWithDefaultQuantity = {
      ...recipe,
      quantity_in_grams: 100, // default quantity
    };
    onAdd(recipeWithDefaultQuantity);
  };

  return (
    <div className={styles.foodItemContainer}>
      <div className={styles.header}>
        <h1 className={styles.foodItemTitle}>{recipe.name}</h1>
        <h2 className={styles.foodItemTitle2}>Serving: 100 grams</h2>
      </div>
      <div className={styles.line}></div>
      <div className={styles.macros}>
        <p>Calories: {recipe.total_calories} kcal</p>
        <p>Carbs: {recipe.total_carbs}g</p>
        <p>Protein: {recipe.total_proteins}g</p>
        <p>Fat: {recipe.total_fats}g</p>
      </div>
      <div className={styles.quantityRow}>
        <button className={styles.addButtonStyled} onClick={handleAdd}>+</button>
      </div>
    </div>
  );
};

export default RecipeItem;
