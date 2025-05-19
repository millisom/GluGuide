import { useEffect, useState } from 'react';
import { getRecipeById, deleteRecipe } from '../api/recipeApi';
import styles from '../styles/RecipeCard.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,         // For Recipe Name/Header
  faPepperHot,    // For Ingredients
  faListCheck,    // For Instructions
  faBalanceScale, // For Nutritional Info
  faTrashAlt      // For Delete Button
} from '@fortawesome/free-solid-svg-icons';

const RecipeCard = ({ recipeId }) => {
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState('Loading recipe details...');

  useEffect(() => {
    const fetchRecipe = async () => {
      setStatus('Loading recipe details...');
      try {
        const data = await getRecipeById(recipeId);
        setRecipe(data);
        setStatus('');
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
        setRecipe(null);
        setStatus('❌ Failed to load recipe. Please check the ID or try again.');
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this recipe? This action cannot be undone.'
    );
    if (!confirmed) return;

    setStatus('Deleting recipe...');
    try {
      await deleteRecipe(recipeId);
      setStatus('✅ Recipe deleted successfully!');
      setRecipe(null);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setStatus('❌ Failed to delete recipe. Please try again.');
    }
  };

  if (!recipe && status) {
    let messageClass = styles.loadingMessage;
    if (status.startsWith('✅')) messageClass = styles.successMessage;
    else if (status.startsWith('❌')) messageClass = styles.errorMessage;
    
    return (
      <div className={`${styles.statusMessage} ${messageClass}`}>
        {status}
      </div>
    );
  }

  if (!recipe) {
    return <div className={`${styles.statusMessage} ${styles.loadingMessage}`}>Preparing recipe...</div>;
  }

  return (
    <div className={styles.recipeDetailContainer}>
      <div className={styles.recipeHeader}>
        <h2 className={styles.recipeNameTitle}>
          <FontAwesomeIcon icon={faBook} style={{ marginRight: '10px' }} />
          {recipe.name || 'Unnamed Recipe'}
        </h2>
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className={styles.recipeSection}>
          <h3 className={styles.sectionTitle}>
            <FontAwesomeIcon icon={faPepperHot} />
            Ingredients
          </h3>
          <ul className={styles.ingredientList}>
            {recipe.ingredients.map((ingredient, i) => (
              <li key={`ing-${i}`}>
                <span className={styles.ingredientName}>{ingredient.name || `Food ID ${ingredient.food_id || 'N/A'}`}</span>
                <span className={styles.ingredientQuantity}> – {ingredient.quantity_in_grams != null ? `${ingredient.quantity_in_grams}g` : 'N/A'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.instructions && recipe.instructions.length > 0 && (
        <div className={styles.recipeSection}>
          <h3 className={styles.sectionTitle}>
            <FontAwesomeIcon icon={faListCheck} />
            Instructions
          </h3>
          <ol className={styles.instructionList}>
            {recipe.instructions.map((step, i) => (
              <li key={`instr-${i}`}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {(recipe.total_calories != null || recipe.total_proteins != null || recipe.total_fats != null || recipe.total_carbs != null) && (
        <div className={styles.recipeSection}>
          <h3 className={styles.sectionTitle}>
            <FontAwesomeIcon icon={faBalanceScale} />
            Nutritional Information (per serving/total)
          </h3>
          <div className={styles.nutritionGrid}>
            <p><strong>Calories:</strong> {recipe.total_calories != null ? `${recipe.total_calories} kcal` : 'N/A'}</p>
            <p><strong>Proteins:</strong> {recipe.total_proteins != null ? `${recipe.total_proteins} g` : 'N/A'}</p>
            <p><strong>Fats:</strong> {recipe.total_fats != null ? `${recipe.total_fats} g` : 'N/A'}</p>
            <p><strong>Carbs:</strong> {recipe.total_carbs != null ? `${recipe.total_carbs} g` : 'N/A'}</p>
          </div>
        </div>
      )}

      <div className={styles.deleteButtonContainer}>
        <button onClick={handleDelete} className={styles.deleteButton} disabled={status === 'Deleting recipe...'}>
          <FontAwesomeIcon icon={faTrashAlt} />
          {status === 'Deleting recipe...' ? 'Deleting...' : 'Delete Recipe'}
        </button>
      </div>
      
      {status && status.startsWith('❌') && recipe && (
        <div className={`${styles.statusMessage} ${styles.errorMessage}`} style={{ marginTop: '15px' }}>{status}</div>
      )}
    </div>
  );
};

RecipeCard.propTypes = {
  recipeId: PropTypes.string.isRequired
};

export default RecipeCard;
