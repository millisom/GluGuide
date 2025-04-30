import React from 'react';
import styles from '../styles/FoodItem.module.css';

const FoodItem = ({ food, onAdd }) => {
  return (
    <div className={styles.foodItemContainer}>
      <div className={styles.header}>
        <h1 className={styles.foodItemTitle}>{food.name}</h1>
        <h2 className={styles.foodItemTitle2}>Serving: 100 grams</h2>
        <button className={styles.addButton} onClick={() => onAdd(food)}>+</button>
      </div>
      <div className={styles.line}></div>
      <div className={styles.macros}>
        <p>Calories: {food.calories} kcal</p>
        <p>Carbs: {food.carbs}g</p>
        <p>Protein: {food.proteins}g</p>
        <p>Fat: {food.fats}g</p>
      </div>
    </div>
  );
};

export default FoodItem;
