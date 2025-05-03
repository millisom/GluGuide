import React, { useState, useEffect } from 'react';
import { getFoodItemByName } from '../api/foodItemApi';
import FoodItem from './FoodItem';
import styles from '../styles/SearchFoodItem.module.css';

const SearchFoodItem = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [skipSuggestions, setSkipSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (skipSuggestions || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await getFoodItemByName(query.toLowerCase());
        const foodArray = Array.isArray(response) ? response : [response];

        const sorted = foodArray.sort((a, b) => {
          const aMatch = a.name.toLowerCase().startsWith(query.toLowerCase());
          const bMatch = b.name.toLowerCase().startsWith(query.toLowerCase());
          return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
        });

        setSuggestions(sorted);
      } catch (err) {
        console.error('Suggestion fetch failed:', err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSuggestionClick = (food) => {
    setSelectedFood(food);
    setSkipSuggestions(true);
    setQuery(food.name);
    setSuggestions([]);
  };

  const handleCloseModal = () => {
    setSelectedFood(null);
    setSkipSuggestions(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search food..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSkipSuggestions(false);
            if (e.target.value === '') {
              setSelectedFood(null);
              setSuggestions([]);
            }
          }}
          className={styles.searchInput}
        />
        {suggestions.length > 0 && (
          <ul className={styles.suggestions}>
            {suggestions.map((food, idx) => (
              <li key={food.food_id || `${food.name}-${idx}`} onClick={() => handleSuggestionClick(food)}>
                {food.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedFood && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            <FoodItem food={selectedFood} onAdd={(item) => {
              onAdd(item);
              handleCloseModal();
              setQuery('');
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFoodItem;
