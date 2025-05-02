import React from "react";
import RecipeCard from "../components/RecipeCard";
import styles from "../styles/LoginForm.module.css";
import RecipesCards from "../components/RecipesCards";

const SummaryPage = () => {
  return (
    <div className={styles.loginContainer}>
        <RecipeCard />
        <RecipesCards />
    </div>
  );
};

export default SummaryPage;