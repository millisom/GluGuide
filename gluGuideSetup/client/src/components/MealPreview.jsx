import React from 'react';
import styles from '../styles/MealPreview.module.css';

const MealPreview = ({ items, selectedRecipe, onRemove }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Selected Food Items</h3>

      {items.length === 0 ? (
        <p>No items added.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              {item.name} – {item.quantity_in_grams || 100}g
              <button onClick={() => onRemove(index)} className={styles.removeBtn}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      {selectedRecipe && (
        <div className={styles.recipeInfo}>
          <h4>Selected Recipe:</h4>
          <p className={styles.recipeName}>{selectedRecipe.name}</p>

          {Array.isArray(selectedRecipe.ingredients) && (
            <ul className={styles.recipeIngredients}>
              {selectedRecipe.ingredients.map((ing, i) => (
                <li key={i}>
                  {ing.food_name} – {ing.quantity_in_grams}g
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPreview;
