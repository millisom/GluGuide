import React from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import styles from '../styles/MyAccount.module.css';

const MyAccount = () => {
    return (
        <div className={styles.myAccount}>
            <div className={styles.profileCardContainer}>
                <ProfileCard />
            </div>

            <Link to="/logMeal" className={styles.logMealButton}>
                <button>Log a New Meal</button>
            </Link>

            <Link to="/CreateRecipe" className={styles.logMealButton}>
                <button>Create Recipe</button>
            </Link>

        </div>
        
    );
};

export default MyAccount;
