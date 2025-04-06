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

    getLogsByFilter: async (userId, filter) => {
        if (!userId) {
            throw new Error('User ID is required.');
        }
    
        let query;
        let values = [userId]; // User ID as the first parameter
    
        // Filter logic based on specified filter criteria
        switch (filter) {
            case '3months':
                query = `
                    SELECT * FROM glucose_logs 
                    WHERE user_id = $1 
                      AND TO_TIMESTAMP(CONCAT(date, ' ', time), 'YYYY-MM-DD HH24:MI:SS') >= NOW() - INTERVAL '3 months'
                    ORDER BY date, time`;
                break;
    
            case '1week':
                query = `
                    SELECT * FROM glucose_logs 
                    WHERE user_id = $1 
                      AND TO_TIMESTAMP(CONCAT(date, ' ', time), 'YYYY-MM-DD HH24:MI:SS') >= NOW() - INTERVAL '7 days'
                    ORDER BY date, time`;
                break;
    
            case '24hours':
                query = `
                    SELECT * FROM glucose_logs 
                    WHERE user_id = $1 
                      AND TO_TIMESTAMP(CONCAT(date, ' ', time), 'YYYY-MM-DD HH24:MI:SS') >= NOW() - INTERVAL '1 day'
                    ORDER BY date, time`;
                break;
    
            default:
                // Default to returning all logs if no valid filter is provided
                query = `
                    SELECT * FROM glucose_logs 
                    WHERE user_id = $1 
                    ORDER BY date, time`;
        }
    
        try {
            // Log query execution for debugging
            console.log(`Executing query for filter: ${filter}`);
            console.log(`Query being executed: ${query}`);
    
            const result = await db.query(query, values);
            console.log('Query result:', result.rows); // Log the result set
    
            return result.rows;
        } catch (err) {
            console.error('Error in getLogsByFilter:', err);
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

    getLogsByTimePeriod: async (userId, timePeriod) => {
        if (!userId || !timePeriod) {
            throw new Error('User ID and time period are required.');
        }
    
        const query = `
            SELECT * 
            FROM glucose_logs 
            WHERE user_id = $1 
              AND TO_TIMESTAMP(CONCAT(date, ' ', time), 'YYYY-MM-DD HH24:MI:SS') >= NOW() - $2::INTERVAL
            ORDER BY date, time
        `;
        const values = [userId, timePeriod]; // Ensure the parameters are defined and valid
    
        try {
            console.log('Executing query:', query); // Log the query for debugging
            console.log('With values:', values); // Log the parameter values
            const result = await db.query(query, values);
            return result.rows;
        } catch (err) {
            console.error('Error in getLogsByTimePeriod:', err);
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
