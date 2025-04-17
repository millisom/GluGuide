import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AlertForm.module.css';

const AlertForm = () => {
    const [email, setEmail] = useState('');
    const [reminderFrequency, setReminderFrequency] = useState('daily');
    const [reminderTime, setReminderTime] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/alerts', {
                email,
                reminderFrequency,
                reminderTime,
            }, {
                withCredentials: true, // Allows cookies to be sent with the request
            });
            

            setMessage(response.data.message || 'Alert preferences saved!');
        } catch (error) {
            console.error('Error setting alert preferences:', error);
            setMessage('Failed to save alert preferences. Please try again.');
        }
    };

    return (
        <div className="alert-form">
            <h2>Set Reminder Alerts</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="reminderFrequency">Reminder Frequency:</label>
                    <select
                        id="reminderFrequency"
                        value={reminderFrequency}
                        onChange={(e) => setReminderFrequency(e.target.value)}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="reminderTime">Reminder Time:</label>
                    <input
                        type="time"
                        id="reminderTime"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                    />
                </div>

                <button type="submit">Save Preferences</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AlertForm;
