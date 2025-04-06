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
    const [filter, setFilter] = useState('24hours'); // Default filter set to "Last 24 Hours"

    // Fetch the current user's ID when the component mounts
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:8080/currentUser', { withCredentials: true });
                setUserId(response.data.userId);
                console.log(`Logged-in userId: ${response.data.userId}`);
            } catch (error) {
                console.error('Error fetching userId:', error.response ? error.response.data : error.message);
                setError('Failed to retrieve user information. Please log in.');
            }
        };
        fetchUserId();
    }, []);

    // Fetch glucose logs for the current user with the default filter ("Last 24 Hours")
    useEffect(() => {
        const fetchLogs = async () => {
            if (!userId) return;
    
            try {
                console.log('Sending request with filter:', filter); // Log the filter being sent
                const response = await axios.get(`http://localhost:8080/glucose/${userId}`, {
                    params: { filter }, // Include the filter in the request
                    withCredentials: true,
                });
                console.log('Fetched logs with filter:', filter, response.data); // Log the response data
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs:', error.response ? error.response.data : error.message);
                if (error.response && error.response.status === 404) {
                    setLogs([]);
                } else {
                    setError('Failed to fetch glucose logs.');
                }
            }
        };
    
        fetchLogs();
    }, [userId, filter]); 

    // Submit a new glucose log for the current user
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const data = { date, time, glucoseLevel, userId };
            await axios.post('http://localhost:8080/glucose/log', data, { withCredentials: true });
    
            // Reset input fields and display success message
            setDate('');
            setTime('');
            setGlucoseLevel('');
            setSuccessMessage('Glucose log added successfully!');
            setError('');
    
            // Refresh logs
            const response = await axios.get(`http://localhost:8080/glucose/${userId}`, { params: { filter }, withCredentials: true });
            setLogs(response.data);
        } catch (error) {
            console.error('Error adding glucose log:', error.response ? error.response.data : error.message);
    
            // Update the error message based on the server response
            if (error.response && error.response.data.error) {
                setError(error.response.data.error); // Display specific error from backend
            } else {
                setError('Failed to add glucose log. Please try again.');
            }
    
            setSuccessMessage(''); // Clear success message in case of error
        }
    };
    

    // Format logs for graph
    const formatLogsForGraph = logs.map((log) => ({
        name: `${new Date(log.date).toLocaleDateString()} ${log.time}`,
        glucose: parseFloat(log.glucose_level),
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

            {/* Filter Options */}
            <div className={styles.filterContainer}>
                <h3>Filter Data</h3>
                <select
                    onChange={(e) => {
                        setFilter(e.target.value);
                        console.log('Filter changed to:', e.target.value); // Add this for debugging
                    }}
                    value={filter} // Default filter is "24hours"
                >
                    <option value="24hours">Last 24 Hours</option>
                    <option value="1week">Last Week</option>
                    <option value="3months">Last 3 Months</option>
                    <option value="all">All Data</option>
                </select>
            </div>

            {/* Table and Graph */}
            <div className={styles.logsContainer}>
                <h3>Logged Data</h3>
                {logs.length > 0 ? (
                    <>
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
                        <h3>Glucose Levels Over Time</h3>
                        <LineChart width={600} height={300} data={formatLogsForGraph}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="glucose" stroke="#8884d8" />
                        </LineChart>
                    </>
                ) : (
                    <p>No glucose logs found for this user. Please log your glucose levels above!</p>
                )}
            </div>
        </div>
    );
};

export default GlucoseLog;

