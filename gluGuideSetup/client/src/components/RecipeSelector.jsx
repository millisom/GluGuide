import React, { useState, useEffect } from 'react';
import { getRecipeById, getRecipeByName } from '../api/recipeApi';
import styles from '../styles/RecipeSelector.module.css';
import RecipeItem from './RecipeItem';

const RecipeSelector = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [skipSuggestions, setSkipSuggestions] = useState(false);
    const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (skipSuggestions || query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await getRecipeByName(query.toLowerCase());
        const recipeArray = Array.isArray(data) ? data : [data];

        const filtered = recipeArray.filter(recipe =>
          recipe.name.toLowerCase().includes(query.toLowerCase())
        );

        const sorted = filtered.sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(query.toLowerCase());
          const bStarts = b.name.toLowerCase().startsWith(query.toLowerCase());
          return aStarts === bStarts ? 0 : aStarts ? -1 : 1;
        });

        setSuggestions(sorted);
      } catch (err) {
        console.error('Failed to load recipe suggestions', err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query, skipSuggestions]);

  const handleSelect = async (recipe) => {
    setSkipSuggestions(true);
    setQuery(recipe.name);
    setSuggestions([]);
    try {
      const fullRecipe = await getRecipeById(recipe.id);
      setResults([fullRecipe]);
    } catch (err) {
      console.error('Failed to load recipe details', err);
      setResults([]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search recipe..."
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
          {suggestions.map((recipe, index) => (
            <li
              key={recipe.id || `${recipe.name}-${index}`}
              onClick={() => handleSelect(recipe)}
            >
              {recipe.name}
            </li>
          ))}
        </ul>
      )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.foodGrid}>
        {results.map((recipe, index) => (
          <RecipeItem
            key={recipe.id || `${recipe.name}-${index}`}
            recipe={recipe}
            onAdd={(item) => {
              onSelect(item);
              setResults([]);
              setQuery('');
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeSelector;