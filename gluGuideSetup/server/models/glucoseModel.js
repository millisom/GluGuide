const db = require('../config/db'); // Import the database connection

const LogModel = {
    // Function to log a new glucose entry
    createLog: async (userId, date, time, glucoseLevel) => {
        const query = `INSERT INTO glucose_logs (user_id, date, time, glucose_level) VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [userId, date, time, glucoseLevel];
        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (err) {
            console.error('Error creating glucose log:', err);
            throw err;
        }
    },

    // Function to fetch all logs for a specific user
    getLogsByUser: async (userId) => {
        const query = `SELECT * FROM glucose_logs WHERE user_id = $1 ORDER BY date, time`;
        try {
            const result = await db.query(query, [userId]);
            return result.rows;
        } catch (err) {
            console.error('Error fetching user logs:', err);
            throw err;
        }
    },

    // Function to fetch a specific log by its ID
    getLogById: async (id) => {
        const query = `SELECT * FROM glucose_logs WHERE id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (err) {
            console.error('Error fetching log by ID:', err);
            throw err;
        }
    },

    // Function to update a specific log
    updateLog: async (id, date, time, glucoseLevel) => {
        const query = `UPDATE glucose_logs SET date = $1, time = $2, glucose_level = $3 WHERE id = $4 RETURNING *`;
        const values = [date, time, glucoseLevel, id];
        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (err) {
            console.error('Error updating log:', err);
            throw err;
        }
    },

    // Function to delete a specific log
    deleteLog: async (id) => {
        const query = `DELETE FROM glucose_logs WHERE id = $1`;
        try {
            await db.query(query, [id]);
            return true;
        } catch (err) {
            console.error('Error deleting log:', err);
            throw err;
        }
    },
};

module.exports = LogModel;
