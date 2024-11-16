import React from 'react';
import ProfileCard from '../components/ProfileCard';
import styles from '../styles/MyAccount.module.css';

const MyAccount = () => {
    return (
        <div className={styles.myAccount}>
            <div className={styles.profileCardContainer}>
                <ProfileCard />
            </div>
        </div>
    );
};

export default MyAccount;
