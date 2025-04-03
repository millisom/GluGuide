import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/GlucoseLog.module.css'; // Add styles specific to this component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const GlucoseLog = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [glucoseLevel, setGlucoseLevel] = useState('');
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchLogs = async () => {
        try {
            const userId = 1; // Replace with dynamic user ID retrieval logic
            const response = await axios.get(`http://localhost:8080/glucose/${userId}`, {
                withCredentials: true,
            });
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setError('Failed to fetch glucose logs');
        }
    };

    useEffect(() => {
        fetchLogs(); // Fetch logs on component mount
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const userId = 1; // Replace with dynamic user ID retrieval logic
            const data = { userId, date, time, glucoseLevel };
            await axios.post('http://localhost:8080/glucose/log', data, { withCredentials: true });
            
            setDate('');
            setTime('');
            setGlucoseLevel('');
            setSuccessMessage('Glucose log added successfully!');
            setError('');
            fetchLogs(); // Refresh logs after submission
        } catch (error) {
            console.error('Error logging glucose:', error);
            setError('Failed to add glucose log');
            setSuccessMessage('');
        }
    };

    const formatLogsForGraph = logs.map((log) => ({
        name: `${log.date} ${log.time}`,
        glucose: log.glucose_level,
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
                <table className={styles.logsTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Glucose Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.date}</td>
                                <td>{log.time}</td>
                                <td>{log.glucose_level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
