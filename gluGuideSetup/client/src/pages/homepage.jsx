import React, { useEffect, useState } from 'react';
import GlucoseLog from "../components/GlucoseLog"; 
import AlertForm from "../components/AlertForm"; 
import AlertsTable from "../components/AlertsTable"; 
import styles from '../styles/Homepage.module.css';

const Homepage = () => {
    const [fetchAlerts, setFetchAlerts] = useState(null);

    const registerFetchAlerts = (fetchFunction) => {
        setFetchAlerts(() => fetchFunction); // Set fetchAlerts dynamically
    };

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
                <AlertForm fetchAlerts={fetchAlerts} />
            </div>

            <div className={styles.alertFormSection}>
                <AlertsTable registerFetchAlerts={registerFetchAlerts} />
            </div>
        </div>
    );
};

export default Homepage;

