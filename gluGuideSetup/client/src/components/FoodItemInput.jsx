import PropTypes from 'prop-types';
import SearchFoodItem from './SearchFoodItem';
import styles from '../styles/FoodItemInput.module.css';

const FoodItemInput = ({ onAdd }) => {
  return (
    <div className={styles.container}>
      <SearchFoodItem onAdd={onAdd} />
    </div>
  );
};

FoodItemInput.propTypes = {
  onAdd: PropTypes.func.isRequired
};

export default FoodItemInput;
