import { useEffect, useState } from 'react';
import { getAllRecipes } from '../api/recipeApi';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RecipesCards.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const RecipesCards = () => {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState('Loading recipes...');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      setStatus('Loading recipes...');
      try {
        const data = await getAllRecipes();
        setRecipes(data);
        if (data.length === 0) {
          setStatus('No recipes found yet. How about creating your first culinary masterpiece?');
        } else {
          setStatus('');
        }
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
        setStatus('❌ Failed to load recipes. Please refresh the page or try again later.');
      }
    };

    fetchRecipes();
  }, []);

  if (status && recipes.length === 0) {
    let statusStyle = styles.statusMessageContainer;
    let messageIcon = faBookReader;
    let messageTitle = 'Loading...';

    if (status.startsWith('No recipes')) {
      statusStyle = `${styles.statusMessageContainer} ${styles.noRecipesMessage}`;
      messageIcon = faPlusCircle;
      messageTitle = 'Your Cookbook is Empty';
    } else if (status.startsWith('❌')) {
      statusStyle = `${styles.statusMessageContainer} ${styles.errorMessage}`;
      messageTitle = 'Error Loading Recipes';
    }
    
    return (
      <div className={statusStyle}>
        <FontAwesomeIcon icon={messageIcon} size="3x" style={{ marginBottom: '20px' }} />
        <h2>{messageTitle}</h2>
        <p>{status}</p>
      </div>
    );
  }

  return (
      <div className={styles.recipesGrid}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className={styles.recipeSummaryCard}>
            <h3 className={styles.recipeName}>{recipe.name || 'Unnamed Recipe'}</h3>
            {recipe.total_calories != null && (
                <p className={styles.recipeCalories}>
                    <strong>Total Calories:</strong> {recipe.total_calories} kcal
                </p>
            )}
            <button
              className={styles.viewRecipeButton}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              View Full Recipe
            </button>
          </div>
        ))}
      </div>
  );
};

export default RecipesCards;
