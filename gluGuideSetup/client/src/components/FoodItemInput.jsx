import React from 'react';
import SearchFoodItem from './SearchFoodItem';
import styles from '../styles/FoodItemInput.module.css';

const FoodItemInput = ({ onAdd }) => {
  return (
    <div className={styles.container}>
      <SearchFoodItem onAdd={onAdd} />
    </div>
  );
};

export default FoodItemInput;
