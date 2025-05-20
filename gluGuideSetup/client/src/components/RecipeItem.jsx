import PropTypes from 'prop-types';
import styles from '../styles/RecipeItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const RecipeItem = ({ recipe, onAdd }) => {
  if (!recipe) {
    return <div className={styles.loading}>Loading recipe details...</div>;
  }

  const { name, description, total_calories, total_proteins, total_fats, total_carbs, ingredients } = recipe;

  return (
    <div className={styles.recipeItemContainer}>
      <h2 className={styles.recipeName}>{name || 'Recipe Name'}</h2>
      
      {description && (
        <p className={styles.recipeDescription}>{description}</p>
      )}

      <div className={styles.nutritionSection}>
        <h3 className={styles.sectionTitle}>Nutritional Information (Total)</h3>
        <div className={styles.nutritionGrid}>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Calories:</span>
            <span className={styles.nutritionValue}>{total_calories || 0} kcal</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Protein:</span>
            <span className={styles.nutritionValue}>{total_proteins || 0} g</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Fat:</span>
            <span className={styles.nutritionValue}>{total_fats || 0} g</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Carbs:</span>
            <span className={styles.nutritionValue}>{total_carbs || 0} g</span>
          </div>
        </div>
      </div>

      {ingredients && ingredients.length > 0 && (
        <div className={styles.ingredientsSection}>
          <h3 className={styles.sectionTitle}>Ingredients</h3>
          <ul className={styles.ingredientsList}>
            {ingredients.map((ing, index) => (
              <li key={index} className={styles.ingredientItem}>
                {ing.food_item?.name || ing.name} - {ing.quantity_in_grams}g
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => onAdd(recipe)} className={styles.addRecipeButton}>
        <FontAwesomeIcon icon={faPlusCircle} /> Add This Recipe to Meal
      </button>
    </div>
  );
};

RecipeItem.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    total_calories: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    total_proteins: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    total_fats: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    total_carbs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ingredients: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      food_item: PropTypes.shape({ name: PropTypes.string }),
      quantity_in_grams: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
  }),
  onAdd: PropTypes.func.isRequired,
};

export default RecipeItem;
