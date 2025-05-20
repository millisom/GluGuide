import MealsCards from '../components/MealsCards';
import styles from '../styles/pages.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

const MealsOverviewPage = () => {
  return (
    <div className={styles.mealsOverviewPageContainer}>
      <div className={styles.mealsPageHeader}>
        <h1 className={styles.mealsPageTitle}>
          <FontAwesomeIcon icon={faUtensils} style={{ marginRight: '15px' }} />
          My Meals
        </h1>
      </div>
      <MealsCards />
    </div>
  );
};

export default MealsOverviewPage;
