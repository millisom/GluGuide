import React, { useEffect, useState } from 'react';
import { getAllMealsForUser } from '../api/mealApi';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RecipeCard.module.css';

const MealsCards = () => {
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await getAllMealsForUser();
        setMeals(data);
      } catch (error) {
        console.error('Failed to fetch meals:', error);
        setStatus('❌ Failed to load meals.');
      }
    };

    fetchMeals();
  }, []);

  if (status) return <p className={styles.status}>{status}</p>;
  if (meals.length === 0) return <p className={styles.status}>No meals found.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
      {meals.map((meal) => (
        <div key={meal.meal_id} className={styles.container} style={{ width: '300px' }}>
          <h3 className={styles.title}>{meal.meal_type?.toUpperCase()}</h3>
          <p className={styles.boxTitle}>
            <strong>Date:</strong>{' '}
            {new Date(meal.meal_time).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className={styles.boxTitle}>	
          <strong>Time:</strong>{' '}
            {new Date(meal.meal_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className={styles.title}><strong>Calories:</strong> {meal.total_calories} kcal</p>
          <button
            className={styles.submitButton}
            onClick={() => navigate(`/meals/${meal.meal_id}`)}
          >
            View Meal
          </button>
        </div>
      ))}
    </div>
  );
};

export default MealsCards;
