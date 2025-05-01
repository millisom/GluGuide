import React from 'react';
import styles from '../styles/MealPreview.module.css';

const MealPreview = ({ items, selectedRecipe, onRemove, onEdit, onRemoveRecipe, onEditRecipe }) => {
  const hasContent = items.length > 0 || selectedRecipe;

  return (
    <div className={styles.container}>
      {!hasContent ? (
        <p className={styles.emptyText}>No items added.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={`food-${index}`} className={styles.item}>
              <div className={styles.itemText}>
                {item.name} – {item.quantity_in_grams || 100}g
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.removeBtn} onClick={() => onRemove(index)}>x</button>
              </div>
            </li>
          ))}

          {selectedRecipe && (
            <li className={styles.item}>
              <div className={styles.itemText}>
                {selectedRecipe.name} (Recipe)
              </div>
              <div className={styles.actionButtons}>
                <button className={styles.removeBtn} onClick={onRemoveRecipe}>x</button>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default MealPreview;
