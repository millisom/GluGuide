import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/AlertsTable.module.css';

const AlertsTable = ({ registerFetchAlerts }) => {
    const [alerts, setAlerts] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    const fetchAlerts = async () => {
        if (!userId) return; // Wait until userId is available
        try {
            const response = await axios.get(`http://localhost:8080/alerts/${userId}`, {
                withCredentials: true,
            });
            console.log('Fetched Alerts:', response.data); // Debug log
            setAlerts(response.data);
        } catch (err) {
            console.error('Error fetching alerts:', err);
            setError('Failed to fetch alerts. Please try again.');
        }
    };

    useEffect(() => {
        const fetchUserAndAlerts = async () => {
            try {
                const userResponse = await axios.get('http://localhost:8080/currentUser', { withCredentials: true });
                const userId = userResponse.data.userId;
                setUserId(userId);

                await fetchAlerts(); // Fetch alerts after userId is set
            } catch (err) {
                console.error('Error fetching user or alerts:', err);
                setError('Failed to fetch alerts. Please try again.');
            }
        };

        fetchUserAndAlerts();

        if (registerFetchAlerts) {
            registerFetchAlerts(fetchAlerts); // Register fetchAlerts
        }
    }, []); // Runs only once on component mount

    return (
        <div className={styles.alertsTableContainer}>
            <h2 className={styles.tableHeader}>Your Alerts</h2>
            {error ? (
                <p className={styles.errorMessage}>{error}</p>
            ) : (
                <table className={styles.alertsTable}>
                    <thead>
                        <tr>
                            <th>Frequency</th>
                            <th>Time</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alerts.length > 0 ? (
                            alerts.map((alert) => (
                                <tr key={alert.alert_id}>
                                    <td>{alert.reminder_frequency}</td>
                                    <td>{alert.reminder_time}</td>
                                    <td>{new Date(alert.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No alerts found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AlertsTable;

