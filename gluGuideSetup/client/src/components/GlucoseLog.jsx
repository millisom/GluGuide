import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
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
  
  const [editingLogId, setEditingLogId] = useState(null);
  const [editedGlucoseLevel, setEditedGlucoseLevel] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get('/currentUser', { withCredentials: true });
        console.log("✅ userId from /currentUser:", response.data.userId); // <-- Add this
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

      console.log("📡 Fetching glucose logs with:", {
        userId,
        filter,
      });

      try {
        const response = await axiosInstance.get(`/glucose/${userId}`, {
          params: { filter },
          withCredentials: true,
        });
        setLogs(response.data);
        setError('');
    } catch (error) {
        if (error.response && error.response.status === 404) {
          setLogs([]);
          setError('');
        } else {
          setError('Failed to fetch glucose logs.');
        }
      }
    };
    fetchLogs();
  }, [userId, filter]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = { date, time, glucoseLevel, userId };
      await axiosInstance.post('/glucose/log', data, { withCredentials: true });
      setDate('');
      setTime('');
      setGlucoseLevel('');
      setSuccessMessage('Glucose log added successfully!');
      setError('');
      const response = await axiosInstance.get(`/glucose/${userId}`, { params: { filter }, withCredentials: true });
      setLogs(response.data);
    } catch (error) {
      setError('Failed to add glucose log. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleEditClick = (log) => {
    setEditingLogId(log.id);
    setEditedGlucoseLevel(log.glucose_level);
  };

  const handleCancelEdit = () => {
    setEditingLogId(null);
    setEditedGlucoseLevel('');
  };

  const handleSaveEdit = async (log) => {
    try {
      await axiosInstance.put(`/glucose/log/${log.id}`, {
        date: log.date,
        time: log.time,
        glucoseLevel: editedGlucoseLevel,
      }, { withCredentials: true });
      setEditingLogId(null);
      setEditedGlucoseLevel('');
      setSuccessMessage('Glucose log updated successfully!');
      setError('');
      const response = await axiosInstance.get(`/glucose/${userId}`, { params: { filter }, withCredentials: true });
      setLogs(response.data);
    } catch (error) {
      setError('Failed to update glucose log. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this glucose log?')) return;
    try {
      await axiosInstance.delete(`/glucose/log/${logId}`, { withCredentials: true });
      setSuccessMessage('Glucose log deleted successfully!');
      setError('');
      const response = await axiosInstance.get(`/glucose/${userId}`, { params: { filter }, withCredentials: true });
      setLogs(response.data);
    } catch (error) {
      setError('Failed to delete glucose log. Please try again.');
      setSuccessMessage('');
    }
  };

  const formatLogsForGraph = logs.map((log) => ({
    name: `${new Date(log.date).toLocaleDateString()} ${log.time}`,
    glucose: parseFloat(log.glucose_level),
  }));

  const displayedLogs = isExpanded ? logs : logs.slice(-3);

  // Map filter values to human-friendly text
  const filterMap = {
    '24hours': '24 hours',
    '1week': 'the past week',
    '3months': '3 months',
    'all': 'all time',
  };
  const emptyMessage = `No logs in the past ${filterMap[filter] || ''}`;

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
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="24hours">Last 24 Hours</option>
          <option value="1week">Last Week</option>
          <option value="3months">Last 3 Months</option>
          <option value="all">All Data</option>
        </select>
      </div>

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

      <div className={styles.glucoseLogsContainer}>
        <h3 className={styles.tableHeader}>Logged Data</h3>
        <table className={styles.glucoseLogsTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Glucose Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedLogs.length > 0 ? (
              displayedLogs.map((log) =>
                editingLogId === log.id ? (
                  <tr key={log.id}>
                    <td>{new Date(log.date).toLocaleDateString()}</td>
                    <td>{log.time}</td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={editedGlucoseLevel}
                        onChange={(e) => setEditedGlucoseLevel(e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSaveEdit(log)} className={styles.saveButton}>
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className={styles.cancelButton}>
                        Cancel
                      </button>
                      <button onClick={() => handleDeleteLog(log.id)} className={styles.deleteButton}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={log.id}>
                    <td>{new Date(log.date).toLocaleDateString()}</td>
                    <td>{log.time}</td>
                    <td>{log.glucose_level}</td>
                    <td>
                      <button onClick={() => handleEditClick(log)} className={styles.editButton}>
                        Edit
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="4">{emptyMessage}</td>
              </tr>
            )}
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
