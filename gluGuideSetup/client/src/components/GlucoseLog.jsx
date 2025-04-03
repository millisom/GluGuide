import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../styles/GlucoseLog.module.css';

const GlucoseLog = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [glucoseLevel, setGlucoseLevel] = useState('');
    const [logs, setLogs] = useState([]);
    const [userId, setUserId] = useState(null); // State to store userId
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch the current user's ID when the component mounts
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:8080/currentUser', { withCredentials: true });
                setUserId(response.data.userId); // Store userId in state
                console.log(`Logged-in userId: ${response.data.userId}`);
            } catch (error) {
                console.error('Error fetching userId:', error.response ? error.response.data : error.message);
                setError('Failed to retrieve user information. Please log in.');
            }
        };
        fetchUserId();
    }, []);

    // Fetch glucose logs for the current user
    useEffect(() => {
        const fetchLogs = async () => {
            if (!userId) return; // Wait until userId is available

            try {
                const response = await axios.get(`http://localhost:8080/glucose/${userId}`, { withCredentials: true });
                console.log('Fetched logs:', response.data);
                setLogs(response.data); // Update logs state
            } catch (error) {
                console.error('Error fetching logs:', error.response ? error.response.data : error.message);
                setError('Failed to fetch glucose logs.');
            }
        };

        fetchLogs(); // Call fetchLogs after userId is available
    }, [userId]); // Rerun the effect whenever userId changes

    // Submit a new glucose log for the current user
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = { date, time, glucoseLevel, userId }; // Include userId in request
            await axios.post('http://localhost:8080/glucose/log', data, { withCredentials: true });

            setDate('');
            setTime('');
            setGlucoseLevel('');
            setSuccessMessage('Glucose log added successfully!');
            setError('');

            // Refresh logs
            const response = await axios.get(`http://localhost:8080/glucose/${userId}`, { withCredentials: true });
            setLogs(response.data);
        } catch (error) {
            console.error('Error adding glucose log:', error.response ? error.response.data : error.message);
            setError('Failed to add glucose log.');
            setSuccessMessage('');
        }
    };

    // Format logs for graph
    const formatLogsForGraph = logs.map((log) => ({
        name: `${new Date(log.date).toLocaleDateString()} ${log.time}`, // Format date and time for X-axis labels
        glucose: parseFloat(log.glucose_level), // Ensure glucose_level is numeric
    }));

    return (
        <div className={styles.glucoseLogContainer}>
            <div className={styles.formContainer}>
                <h2>Log Your Glucose Level</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Time:</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Glucose Level:</label>
                        <input
                            type="number"
                            step="0.01"
                            value={glucoseLevel}
                            onChange={(e) => setGlucoseLevel(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>Log Glucose</button>
                </form>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            </div>
            <div className={styles.logsContainer}>
                <h3>Logged Data</h3>
                {logs.length > 0 ? (
                    <table className={styles.logsTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Glucose Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td>{new Date(log.date).toLocaleDateString()}</td>
                                    <td>{log.time}</td>
                                    <td>{log.glucose_level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No glucose logs found for this user.</p>
                )}
                <h3>Glucose Levels Over Time</h3>
                <LineChart width={600} height={300} data={formatLogsForGraph}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="glucose" stroke="#8884d8" />
                </LineChart>
            </div>
        </div>
    );
};

export default GlucoseLog;
