const pool = require('../config/db');

const Alert = {
    // Method to create a new alert
    async createAlert(userId, reminderFrequency, reminderTime) {
        try {
            // Step 1: Get email based on userId
            const emailQuery = 'SELECT email FROM users WHERE id = $1';
            const emailResult = await pool.query(emailQuery, [userId]);

            if (emailResult.rows.length === 0) {
                throw new Error('User not found');
            }

            const email = emailResult.rows[0].email;

            // Step 2: Insert the alert into the database
            const alertQuery = `
                INSERT INTO alerts (user_id, reminder_frequency, reminder_time, created_at)
                VALUES ($1, $2, $3, NOW())
                RETURNING *
            `;
            const alertValues = [userId, reminderFrequency, reminderTime];
            const alertResult = await pool.query(alertQuery, alertValues);

            return { ...alertResult.rows[0], email }; // Include email in the response
        } catch (error) {
            throw new Error('Error creating alert: ' + error.message);
        }
    },

    // Method to get User from user table by name and get ID
    async getUserIdByUsername(username) {
        const query = 'SELECT id FROM users WHERE username = $1';
        const values = [username];

        try {
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                return null; // Return null if user is not found
            }
            return result.rows[0].id; // Return user ID
        } catch (error) {
            throw new Error('Error fetching user ID: ' + error.message);
        }
    },

    // Other existing methods
    async getAlertsByUserId(userId) {
        const query = 'SELECT * FROM alerts WHERE user_id = $1';
        const values = [userId];
        try {
            const result = await pool.query(query, values);
            return result.rows; // Return all alerts for the user
        } catch (error) {
            throw new Error('Error fetching alerts: ' + error.message);
        }
    },

    async updateAlert(alertId, email, reminderFrequency, reminderTime) {
        const query = `
            UPDATE alerts
            SET email = $1, reminder_frequency = $2, reminder_time = $3, updated_at = NOW()
            WHERE id = $4
            RETURNING *
        `;
        const values = [email, reminderFrequency, reminderTime, alertId];
        try {
            const result = await pool.query(query, values);
            if (result.rowCount === 0) {
                return null; // No alert was updated
            }
            return result.rows[0]; // Return updated alert
        } catch (error) {
            throw new Error('Error updating alert: ' + error.message);
        }
    },

    async deleteAlert(alertId) {
        const query = 'DELETE FROM alerts WHERE id = $1 RETURNING *';
        const values = [alertId];
        try {
            const result = await pool.query(query, values);
            return result.rowCount; // Return count of deleted rows
        } catch (error) {
            throw new Error('Error deleting alert: ' + error.message);
        }
    },
};

module.exports = Alert;
