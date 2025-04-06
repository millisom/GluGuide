import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import styles from '../styles/Dashboard.module.css';

const GlucoseLog = () => {
    const [logs, setLogs] = useState([]);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [selectedPeriods, setSelectedPeriods] = useState([]); // Track selected time periods
    const [dataSets, setDataSets] = useState([]); // Store data fetched for each time period

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

    // Fetch logs based on selected time periods
    useEffect(() => {
        if (!userId || !selectedPeriods || selectedPeriods.length === 0) return;
    
        const fetchLogsByPeriod = async () => {
            try {
                console.log('Fetching logs for user:', userId);
                console.log('Fetching logs for periods:', selectedPeriods);
    
                const results = await Promise.all(
                    selectedPeriods.map(async (period) => {
                        try {
                            const response = await axios.get(`http://localhost:8080/glucose/${userId}/time-period`, {
                                params: { timePeriod: period },
                                withCredentials: true,
                            });
                            return response.data;
                        } catch (error) {
                            console.error('Error fetching logs for period:', period, error.response || error.message);
                            return [];
                        }
                    })
                );
                setDataSets(results);
            } catch (error) {
                console.error('Error in fetchLogsByPeriod:', error);
            }
        };
    
        fetchLogsByPeriod();
    }, [userId, selectedPeriods]);
    
    

    const addTimePeriod = (period) => {
        if (!selectedPeriods.includes(period)) {
            setSelectedPeriods([...selectedPeriods, period]);
        }
    };

    const removeTimePeriod = (index) => {
        setSelectedPeriods(selectedPeriods.filter((_, i) => i !== index));
        setDataSets(dataSets.filter((_, i) => i !== index));
    };

    const formatLogsForGraph = (logs) =>
        logs.map((log) => ({
            name: `${new Date(log.date).toLocaleDateString()} ${log.time}`,
            glucose: parseFloat(log.glucose_level),
        }));

    return (
        <div className={styles.glucoseLogContainer}>
            <h2>Glucose Dashboard</h2>
            <TimePeriodSelector onAdd={addTimePeriod} />

            <div className={styles.logsContainer}>
                {selectedPeriods.map((period, index) => (
                    <div key={index} className={styles.periodBlock}>
                        <h3>{`Data for ${period}`}</h3>
                        <button onClick={() => removeTimePeriod(index)}>Remove</button>
                        {dataSets[index] && dataSets[index].length > 0 ? (
                            <>
                                <LineChart width={600} height={300} data={formatLogsForGraph(dataSets[index])}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="glucose" stroke="#8884d8" />
                                </LineChart>
                                <table className={styles.logsTable}>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Glucose Level</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataSets[index].map((log) => (
                                            <tr key={log.id}>
                                                <td>{new Date(log.date).toLocaleDateString()}</td>
                                                <td>{log.time}</td>
                                                <td>{log.glucose_level}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p>Loading data...</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Subcomponent: TimePeriodSelector
const TimePeriodSelector = ({ onAdd }) => {
    const options = [
        { label: 'Last 24 Hours', value: '1 day' },
        { label: 'Last 7 Days', value: '7 days' },
        { label: 'Last 30 Days', value: '30 days' },
    ];

    const handleSelect = (event) => {
        const selected = options.find((opt) => opt.value === event.target.value);
        if (selected) onAdd(selected.value);
    };

    return (
        <div className={styles.selectorContainer}>
            <select onChange={handleSelect} defaultValue="">
                <option value="" disabled>
                    Select Time Period
                </option>
                {options.map((opt, index) => (
                    <option key={index} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default GlucoseLog;
