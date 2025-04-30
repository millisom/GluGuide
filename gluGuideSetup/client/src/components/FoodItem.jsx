import React, { useState } from 'react';
import styles from '../styles/FoodItem.module.css';

const FoodItem = ({ food, onAdd }) => {
  const [quantity, setQuantity] = useState('');

  const handleAdd = () => {
    const qty = parseInt(quantity);
    if (!isNaN(qty) && qty > 0) {
      const foodWithQuantity = {
        ...food,
        quantity_in_grams: qty,
      };
      onAdd(foodWithQuantity);
      setQuantity(''); // clear input after add
    } else {
      alert('Please enter a valid quantity in grams.');
    }
  };

  return (
    <div className={styles.foodItemContainer}>
      <div className={styles.header}>
        <h1 className={styles.foodItemTitle}>{food.name}</h1>
        <h2 className={styles.foodItemTitle2}>Serving: 100 grams</h2>
      </div>
      <div className={styles.line}></div>
      <div className={styles.macros}>
        <p>Calories: {food.calories} kcal</p>
        <p>Carbs: {food.carbs}g</p>
        <p>Protein: {food.proteins}g</p>
        <p>Fat: {food.fats}g</p>
      </div>
      <div className={styles.quantityRow}>
        <input
          type="number"
          min="1"
          placeholder="Quantity in grams"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={styles.quantityInput}
        />
        <button className={styles.addButtonStyled} onClick={handleAdd}>+</button>
      </div>
    </div>
  );
};

export default FoodItem;
