import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRecipeById, getRecipeByName } from '../api/recipeApi';
import styles from '../styles/RecipeSelector.module.css';
import RecipeItem from './RecipeItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const RecipeSelector = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
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
        setError('Could not load suggestions');
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
      setSelectedRecipe(fullRecipe);
    } catch (err) {
      console.error('Failed to load recipe details', err);
      setSelectedRecipe(null);
    }
  };

  const handleAdd = (recipe) => {
    onSelect(recipe);
    setSelectedRecipe(null);
    setQuery('');
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
            setError('');
            if (e.target.value.length === 0) {
              setSelectedRecipe(null);
              setSuggestions([]);
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

      {selectedRecipe && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button 
              className={styles.closeButton} 
              onClick={() => setSelectedRecipe(null)}
              aria-label="Close recipe details"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <RecipeItem
              recipe={selectedRecipe}
              onAdd={handleAdd}
            />
          </div>
        </div>
      )}
    </div>
  );
};

RecipeSelector.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default RecipeSelector;
