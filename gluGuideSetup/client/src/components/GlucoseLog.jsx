import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../styles/GlucoseLog.module.css';

const GlucoseLog = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [glucoseLevel, setGlucoseLevel] = useState('');
    const [logs, setLogs] = useState([]);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [filter, setFilter] = useState('24hours');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:8080/currentUser', { withCredentials: true });
                setUserId(response.data.userId);
            } catch (error) {
                setError('Failed to retrieve user information. Please log in.');
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`http://localhost:8080/glucose/${userId}`, {
                    params: { filter },
                    withCredentials: true,
                });
                setLogs(response.data);
            } catch (error) {
                setError('Failed to fetch glucose logs.');
            }
        };
        fetchLogs();
    }, [userId, filter]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const data = { date, time, glucoseLevel, userId };
            await axios.post('http://localhost:8080/glucose/log', data, { withCredentials: true });
            setDate('');
            setTime('');
            setGlucoseLevel('');
            setSuccessMessage('Glucose log added successfully!');
            setError('');
            const response = await axios.get(`http://localhost:8080/glucose/${userId}`, { params: { filter }, withCredentials: true });
            setLogs(response.data);
        } catch (error) {
            setError('Failed to add glucose log. Please try again.');
            setSuccessMessage('');
        }
    };

    const formatLogsForGraph = logs.map((log) => ({
        name: `${new Date(log.date).toLocaleDateString()} ${log.time}`,
        glucose: parseFloat(log.glucose_level),
    }));

    return (
        <div className={styles.glucoseLogContainer}>
            <div className={styles.loggingFormContainer}>
                <h2>Log Your Glucose Level</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputField}>
                        <label className={styles.label}>Date:</label>
                        <input
                            className={styles.input}
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.label}>Time:</label>
                        <input
                            className={styles.input}
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputField}>
                        <label className={styles.label}>Glucose Level:</label>
                        <input
                            className={styles.input}
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

            <div className={styles.filterContainer}>
                <h3>Filter Data</h3>
                <select
                    onChange={(e) => setFilter(e.target.value)}
                    value={filter}
                >
                    <option value="24hours">Last 24 Hours</option>
                    <option value="1week">Last Week</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="all">All Data</option>
                </select>
            </div>

            {/* Separate box for graph */}
            <div className={styles.graphBox}>
                <h3>Glucose Levels Over Time</h3>
                <div className={styles.graphContainer}>
                    <LineChart width={800} height={300} data={formatLogsForGraph}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="glucose" stroke="#8884d8" />
                    </LineChart>
                </div>
            </div>

            {/* Separate box for table */}
            <div className={styles.tableBox}>
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
                        {(isExpanded ? logs : logs.slice(-3)).map((log) => (
                            <tr key={log.id}>
                                <td>{new Date(log.date).toLocaleDateString()}</td>
                                <td>{log.time}</td>
                                <td>{log.glucose_level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length > 3 && (
                    <button onClick={() => setIsExpanded(!isExpanded)} className={styles.toggleButton}>
                        {isExpanded ? 'Show Less' : 'See More'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default GlucoseLog;
