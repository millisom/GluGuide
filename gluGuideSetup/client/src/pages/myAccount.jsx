import React from 'react';
import ProfileCard from '../components/profileCard';
import styles from './pages.module.css';

const MyAccount = () => {
    return (
        <div className={styles.myAccount}>
            <div className={styles.profileCardContainer}>
                <ProfileCard />
            </div>
        </div>
    );
}

export default MyAccount;