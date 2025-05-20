import RecipesCards from "../components/RecipesCards";
import styles from '../styles/pages.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMortarPestle } from '@fortawesome/free-solid-svg-icons';


const RecipeSummaryPage = () => {
  return (
    <div className={styles.recipesSummaryPageContainer}>
      <div className={styles.recipesPageHeader}>
        <h1 className={styles.recipesPageTitle}>
          <FontAwesomeIcon icon={faMortarPestle} style={{ marginRight: '15px' }} />
          My Recipe Collection
        </h1>
      </div>
      <RecipesCards />
    </div>
  );
};

export default RecipeSummaryPage;