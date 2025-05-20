import { useEffect, useState } from 'react';
import { getAllMealsForUser } from '../api/mealApi';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MealsCards.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAppleAlt,
  faDrumstickBite,
  faBreadSlice,
  faLeaf,
  faMugHot,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

const MealsCards = () => {
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState('Loading meals...');
  const navigate = useNavigate();

  const getMealIcon = (mealType) => {
    const type = mealType?.toLowerCase() || '';
    if (type.includes('breakfast')) return faMugHot;
    if (type.includes('lunch')) return faDrumstickBite;
    if (type.includes('dinner')) return faBreadSlice;
    if (type.includes('snack')) return faAppleAlt;
    return faQuestionCircle;
  };

  useEffect(() => {
    const fetchMeals = async () => {
      setStatus('Loading meals...');
      try {
        const data = await getAllMealsForUser();
        setMeals(data);
        if (data.length === 0) {
          setStatus('No meals found. Time to log your first one!');
        } else {
          setStatus('');
        }
      } catch (error) {
        console.error('Failed to fetch meals:', error);
        setStatus('❌ Failed to load meals. Please try again later.');
      }
    };

    fetchMeals();
  }, []);

  if (status && meals.length === 0) {
    let statusStyle = styles.statusMessageContainer;
    if (status.startsWith('No meals')) {
      statusStyle = `${styles.statusMessageContainer} ${styles.noMealsMessage}`;
    } else if (status.startsWith('❌')) {
      statusStyle = `${styles.statusMessageContainer} ${styles.errorMessage}`;
    }
    return (
      <div className={statusStyle}>
        {status.startsWith('No meals') && <FontAwesomeIcon icon={faLeaf} size="3x" style={{ marginBottom: '15px'}} />}
        <h2>{status.startsWith('No meals') ? 'Nothing Here Yet' : 'Oops!'}</h2>
        <p>{status}</p>
      </div>
    );
  }

  return (
    <div className={styles.mealsGrid}>
      {meals.map((meal) => (
        <div key={meal.meal_id} className={styles.mealCard}>
          <h3 className={styles.mealType}>
            <FontAwesomeIcon icon={getMealIcon(meal.meal_type)} /> 
            {meal.meal_type?.toUpperCase() || 'MEAL'}
          </h3>
          <p className={styles.mealDateTime}>
            <strong>Date:</strong>{' '}
            {new Date(meal.meal_time).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            <br/>
            <strong>Time:</strong>{' '}
            {new Date(meal.meal_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
          <p className={styles.mealCalories}>
            <strong>Total Calories:</strong> {meal.total_calories ? `${meal.total_calories} kcal` : 'N/A'}
          </p>
          <button
            className={styles.viewMealButton}
            onClick={() => navigate(`/meals/${meal.meal_id}`)}
          >
            View Meal Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default MealsCards;
