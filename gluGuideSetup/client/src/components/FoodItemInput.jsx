import React, { useState } from 'react';
import { getFoodItemByName } from '../api/foodItemApi';
import FoodItem from './FoodItem';
import styles from '../styles/FoodItemInput.module.css';

const FoodItemInput = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    try {
      const food = await getFoodItemByName(query);
      setResults([food]);
      console.log('Food item fetched:', food);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch food item');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search food item..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.foodGrid}>
        {results.map((food) => (
          <FoodItem key={food.food_id} food={food} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
};

export default FoodItemInput;