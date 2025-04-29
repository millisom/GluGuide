import React, { useRef } from 'react';
import GlucoseLog from "../components/GlucoseLog";
import AlertForm from "../components/AlertForm";
import AlertsTable from "../components/AlertsTable";
import styles from '../styles/Homepage.module.css';

const Homepage = () => {
    const fetchAlertsRef = useRef(null); // Create a ref to store fetchAlerts function

    const registerFetchAlerts = (fetchFunction) => {
        fetchAlertsRef.current = fetchFunction; // Store fetchAlerts in ref
    };

    const refreshAlerts = () => {
        if (fetchAlertsRef.current) {
            fetchAlertsRef.current(); // Call fetchAlerts dynamically
        }
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
                <AlertForm fetchAlerts={refreshAlerts} /> {/* Pass refreshAlerts to AlertForm */}
            </div>

            <div className={styles.alertFormSection}>
                <AlertsTable registerFetchAlerts={registerFetchAlerts} /> {/* Register fetchAlerts */}
            </div>
        </div>
    );
};

export default Homepage;

