import React from 'react';
import { Link } from 'react-router-dom';
import ProfileCard from '../components/profileCard';
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
