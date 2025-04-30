const pool = require('../config/db');

const Alert = {

  async createAlert(userId, reminderFrequency, reminderTime) {
    try {

      const emailQuery = 'SELECT email FROM users WHERE id = $1';
      const emailResult = await pool.query(emailQuery, [userId]);

      if (emailResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const email = emailResult.rows[0].email;


      const alertQuery = `
        INSERT INTO alerts (user_id, reminder_frequency, reminder_time, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      const alertValues = [userId, reminderFrequency, reminderTime];
      const alertResult = await pool.query(alertQuery, alertValues);

      return { ...alertResult.rows[0], email }; 
    } catch (error) {
      throw new Error('Error creating alert: ' + error.message);
    }
  },


  async getUserIdByUsername(username) {
    const query = 'SELECT id FROM users WHERE username = $1';
    const values = [username];

    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return null; 
      }
      return result.rows[0].id; 
    } catch (error) {
      throw new Error('Error fetching user ID: ' + error.message);
    }
  },


  async getAlertsByUserId(userId) {
    const query = 'SELECT * FROM alerts WHERE user_id = $1';
    const values = [userId];
    try {
      const result = await pool.query(query, values);
      return result.rows;
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
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw new Error('Error updating alert: ' + error.message);
    }
  },


  async deleteAlert(alertId) {
    const query = 'DELETE FROM alerts WHERE id = $1 RETURNING *';
    const values = [alertId];
    try {
      const result = await pool.query(query, values);
      return result.rowCount;
    } catch (error) {
      throw new Error('Error deleting alert: ' + error.message);
    }
  },


  async getAlertsDueForSending() {
    const query = `
      SELECT a.*, u.email 
      FROM alerts a 
      JOIN users u ON a.user_id = u.id 
      WHERE a.reminder_time <= CURRENT_TIME
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw new Error('Error fetching due alerts: ' + error.message);
    }
  }
};

module.exports = Alert;
