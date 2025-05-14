import React from 'react';
import MealsCards from '../components/MealsCards'; // adjust path if needed
import styles from '../styles/pages.module.css';

const MealsOverviewPage = () => {
  return (
    <div className={styles.myAccount1}>
      <MealsCards />
    </div>
  );
};

export default MealsOverviewPage;
