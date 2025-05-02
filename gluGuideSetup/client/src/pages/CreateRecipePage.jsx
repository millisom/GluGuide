import React from 'react';
import RecipeDashboard from '../components/RecipeDashboard';
import styles from '../styles/LogMealPage.module.css';

const CreateRecipePage = () => {
  return (
    <div className={styles.container}>
      <RecipeDashboard />
    </div>
  );
};

export default CreateRecipePage;
