import { useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/AlertForm.module.css';

const AlertForm = ({ fetchAlerts }) => {
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [reminderTime, setReminderTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post('/alerts', {
        reminderFrequency,
        reminderTime,
      }, {
        withCredentials: true,
      });

      setMessage(response.data.message || 'Alert preferences saved!');
      setReminderFrequency('daily'); 
      setReminderTime(''); 

  
      if (fetchAlerts) {
        fetchAlerts();
      }
    } catch (error) {
      console.error('Error setting alert preferences:', error);
      setMessage('Failed to save alert preferences. Please try again.');
    }
  };

  return (
    <div className={styles.alertFormContainer}>
      <h2 className={styles.alertFormTitle}>Set Reminder Alerts</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.alertFormField}>
          <label htmlFor="reminderFrequency" className={styles.alertFormLabel}>
            Reminder Frequency:
          </label>
          <select
            id="reminderFrequency"
            value={reminderFrequency}
            onChange={(e) => setReminderFrequency(e.target.value)}
            className={styles.alertFormSelect}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div className={styles.alertFormField}>
          <label htmlFor="reminderTime" className={styles.alertFormLabel}>
            Reminder Time:
          </label>
          <input
            type="time"
            id="reminderTime"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className={styles.alertFormInput}
            required
          />
        </div>

        <button type="submit" className={styles.alertFormButton}>
          Save Preferences
        </button>
      </form>
      {message && <p className={styles.successMessage}>{message}</p>}
    </div>
  );
};

export default AlertForm;
