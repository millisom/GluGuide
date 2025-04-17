import React from 'react';
import GlucoseLog from "../components/GlucoseLog"; 
import AlertForm from "../components/AlertForm"; 
import styles from '../styles/Homepage.module.css';

const Homepage = () => {
    return (
        <div className={styles.homepageContainer}>
            <div className={styles.heroSection}>
                <h1 className={styles.title}>Welcome to GluGuide!</h1>
                <p className={styles.description}>
                    GluGuide is your trusted platform to track blood sugar levels and receive
                    personalized recommendations. We’re here to help you manage your gestational
                    diabetes with confidence and ease.
                </p>
            </div>
            
            <div className={styles.glucoseLogSection}>
                <h2 className={styles.sectionTitle}>Track Your Glucose</h2>
                <GlucoseLog /> 
            </div>

            <div className={styles.alertFormSection}>
                <h2 className={styles.sectionTitle}>Set Reminder Alerts</h2>
                <AlertForm /> {/* Add AlertForm here */}
            </div>


        </div>
    );
};

export default Homepage;
