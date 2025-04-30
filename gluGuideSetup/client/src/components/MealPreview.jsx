import React from 'react';
import styles from '../styles/MealPreview.module.css';

const MealPreview = ({ items, onRemove }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Selected Food Items</h3>
      {items.length === 0 ? <p>No items added.</p> : (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={index} className={styles.item}>
              {item.foodName} - {item.quantity_in_grams || 100}g
              <button onClick={() => onRemove(index)} className={styles.removeBtn}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MealPreview;