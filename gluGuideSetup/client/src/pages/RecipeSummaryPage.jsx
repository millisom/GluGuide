import React from "react";
import RecipesCards from "../components/RecipesCards";
import styles from './pages.module.css';


const SummaryPage = () => {
  return (
    <div className={styles.myAccount1}>
        <RecipesCards />
    </div>
  );
};

export default SummaryPage;