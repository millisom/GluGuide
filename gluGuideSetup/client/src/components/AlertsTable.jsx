import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/AlertsTable.module.css';

const AlertsTable = () => {
    const [alerts, setAlerts] = useState([]);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserAndAlerts = async () => {
            try {
                // Fetch userId
                const userResponse = await axios.get('http://localhost:8080/currentUser', { withCredentials: true });
                const userId = userResponse.data.userId;
                setUserId(userId);

                // Fetch alerts using the fetched userId
                const alertsResponse = await axios.get(`http://localhost:8080/alerts/${userId}`, {
                    withCredentials: true,
                });
                console.log('Fetched Alerts:', alertsResponse.data);
                setAlerts(alertsResponse.data);
            } catch (err) {
                console.error('Error fetching user or alerts:', err);
                setError('Failed to fetch alerts. Please try again.');
            }
        };

        fetchUserAndAlerts();
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
