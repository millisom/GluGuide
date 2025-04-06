import React from 'react';
import ProfileCard from '../components/ProfileCard';
import styles from '../styles/MyAccount.module.css';
import FoodItem from '../components/loggingFoodItem';

const MyAccount = () => {
    return (
        <div className={styles.myAccount}>
            <div className={styles.profileCardContainer}>
                <ProfileCard />
                <FoodItem/>
            </div>
        </div>
    );
};

export default MyAccount;
