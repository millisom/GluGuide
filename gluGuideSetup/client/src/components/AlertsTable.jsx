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
                // Step 1: Fetch userId
                const userResponse = await axios.get('http://localhost:8080/currentUser', { withCredentials: true });
                const userId = userResponse.data.userId;
                setUserId(userId);

                // Step 2: Fetch alerts using the fetched userId
                const alertsResponse = await axios.get(`http://localhost:8080/alerts/${userId}`, {
                    withCredentials: true,
                });
                console.log('Fetched Alerts:', alertsResponse.data); // Debug log
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
                                <tr key={alert.alert_id}> {/* Use correct field */}
                                    <td>{alert.reminder_frequency}</td> {/* Use correct field */}
                                    <td>{alert.reminder_time}</td> {/* Use correct field */}
                                    <td>{new Date(alert.created_at).toLocaleString()}</td> {/* Use correct field */}
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



