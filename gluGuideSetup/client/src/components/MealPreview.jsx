import PropTypes from 'prop-types';
import styles from '../styles/MealPreview.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const MealPreview = ({ items, selectedRecipe, onRemove, onRemoveRecipe }) => {
  const hasContent = items.length > 0 || selectedRecipe;

  return (
    <div className={styles.previewSection}>
      <h2 className={styles.previewTitle}>Current Meal Items</h2>
      {!hasContent ? (
        <div className={styles.emptyPreview}>
          <p>Your meal is looking a bit empty!</p>
          <p>Add food items or select a recipe above.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <li key={`food-${index}`} className={styles.item}>
              <div className={styles.itemText}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemDetails}> – {item.quantity_in_grams || 'N/A'}g</span>
              </div>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.removeBtn} 
                  onClick={() => onRemove(index)} 
                  aria-label={`Remove ${item.name}`}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </li>
          ))}

          {selectedRecipe && (
            <li className={`${styles.item} ${styles.recipeItemPreview}`}>
              <div className={styles.itemText}>
                <span className={styles.itemName}>{selectedRecipe.name}</span>
                <span className={styles.itemDetails}> (Recipe)</span>
              </div>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.removeBtn} 
                  onClick={onRemoveRecipe} 
                  aria-label={`Remove recipe ${selectedRecipe.name}`}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

MealPreview.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    quantity_in_grams: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  selectedRecipe: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  onRemove: PropTypes.func.isRequired,
  onRemoveRecipe: PropTypes.func.isRequired,
  // onEdit: PropTypes.func, // Commented out as not currently used
  // onEditRecipe: PropTypes.func, // Commented out as not currently used
};

MealPreview.defaultProps = {
  selectedRecipe: null,
  // onEdit: () => {}, // Commented out as not currently used
  // onEditRecipe: () => {}, // Commented out as not currently used
};

export default MealPreview;
