import React, { useState, useEffect } from 'react';
import { getFoodItemByName } from '../api/foodItemApi';
import FoodItem from './FoodItem';
import styles from '../styles/FoodItemInput.module.css';

const FoodItemInput = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [skipSuggestions, setSkipSuggestions] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (skipSuggestions || query.length < 2) {
        setSuggestions([]);
        return;
      }
      

      try {
        const response = await getFoodItemByName(query.toLowerCase());
        const foodArray = Array.isArray(response) ? response : [response];

        const sortedSuggestions = foodArray.sort((a, b) => {
          const aStartsWithQuery = a.name.toLowerCase().startsWith(query.toLowerCase());
          const bStartsWithQuery = b.name.toLowerCase().startsWith(query.toLowerCase());
          return (aStartsWithQuery === bStartsWithQuery) ? 0 : aStartsWithQuery ? -1 : 1;
        });

        setSuggestions(sortedSuggestions);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err.response ? err.response.data : err.message);
        setError('Failed to fetch suggestions');
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleSuggestionClick = (food) => {
    setSkipSuggestions(true);
    setQuery(food.name);
    setSuggestions([]);
    setResults([food]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search food item..."
          value={query}
          onChange={(e) => {
            setSkipSuggestions(false);
            setQuery(e.target.value);
            if (e.target.value.length === 0) {
              setResults([]);
            }
          }}          
          className={styles.searchInput}
        />
        {suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((food, index) => (
              <li
                key={food.food_id || `${food.name}-${index}`}
                onClick={() => handleSuggestionClick(food)}
              >
                {food.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.foodGrid}>
        {results.map((food, index) => (
          <FoodItem
            key={food.food_id || `${food.name}-${index}`}
            food={food}
            onAdd={(item) => {
              onAdd(item);
              setResults([]);
              setQuery('');
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodItemInput;
