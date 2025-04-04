const Log = require('../models/glucoseModel'); // Import your log model

const logController = {

    // Log a new glucose entry
    async logGlucose(req, res) {
        // Log the incoming request for debugging
        console.log('Received request at POST /glucose/log');
        console.log('Request body:', req.body);
    
        const userId = req.session?.userId;
        const { date, time, glucoseLevel } = req.body;
    
        // Validate input fields
        if (!userId || !date || !time || !glucoseLevel) {
            console.error('Validation error: Missing fields in request body');
            return res.status(400).json({ error: 'All fields are required: userId, date, time, glucoseLevel' });
        }
    
        try {
            // Log the parameters before sending to the database
            console.log('Calling Log.createLog with:', { userId, date, time, glucoseLevel });
    
            // Attempt to insert the data into the database
            const newLog = await Log.createLog(userId, date, time, glucoseLevel);
    
            // Log the result of the database operation
            console.log('Database insert successful. New log:', newLog);
    
            return res.status(201).json({ success: true, log: newLog });
        } catch (error) {
            // Catch and log any database-related errors
            console.error('Error logging glucose:', error.message);
            return res.status(500).json({ error: 'Failed to log glucose entry. Please try again later.' });
        }
    }
    ,

    // Get all logs for a specific user
    async getUserGlucoseLogs(req, res) {
        const { userId } = req.params;

        try {
            const logs = await Log.getLogsByUser(userId);

            if (logs.length === 0) {
                return res.status(404).json({ message: 'No logs found for this user' });
            }

            return res.status(200).json(logs);
        } catch (error) {
            console.error('Error fetching glucose logs:', error);
            return res.status(500).json({ error: 'Failed to fetch glucose logs' });
        }
    },

    async getGlucoseLogsByTimePeriod(req, res) {
        const { userId } = req.params;
        const { timePeriod } = req.query; // Expect 'timePeriod' to be passed as a query parameter

        console.log('Controller: User ID:', userId);
        console.log('Controller: Time Period:', timePeriod);

        if (!userId) {
            console.error('Error: Missing user ID in session.');
            return res.status(400).json({ error: 'User ID is required for this operation.' });
        }
    
        if (!timePeriod || !['1 day', '7 days', '30 days'].includes(timePeriod)) {
            console.error('Error: Invalid time period.');
            return res.status(400).json({ error: 'Valid time period is required (e.g., 1 day, 7 days, 30 days).' });
        }

        try {
            const logs = await Log.getLogsByTimePeriod(userId, timePeriod); // Call the new model function

            if (logs.length === 0) {
                return res.status(404).json({ message: 'No logs found for the specified time period' });
            }

            return res.status(200).json(logs);
        } catch (error) {
            console.error('Error fetching glucose logs by time period:', error);
            return res.status(500).json({ error: 'Failed to fetch glucose logs' });
        }
    },


    // Get a specific log by ID
    async getGlucoseLogById(req, res) {
        const { id } = req.params;

        try {
            const log = await Log.getLogById(id);

            if (!log) {
                return res.status(404).json({ message: 'Log not found' });
            }

            return res.status(200).json(log);
        } catch (error) {
            console.error('Error fetching glucose log by ID:', error);
            return res.status(500).json({ error: 'Failed to fetch glucose log' });
        }
    },

    // Update a specific log
    async updateGlucoseLog(req, res) {
        const { id } = req.params;
        const { date, time, glucoseLevel } = req.body;

        try {
            const updatedLog = await Log.updateLog(id, date, time, glucoseLevel);

            if (!updatedLog) {
                return res.status(404).json({ message: 'Log not found' });
            }

            return res.status(200).json({ success: true, log: updatedLog });
        } catch (error) {
            console.error('Error updating glucose log:', error);
            return res.status(500).json({ error: 'Failed to update glucose log' });
        }
    },

    // Delete a specific log
    async deleteGlucoseLog(req, res) {
        const { id } = req.params;

        try {
            const deleted = await Log.deleteLog(id);

            if (!deleted) {
                return res.status(404).json({ message: 'Log not found' });
            }

            return res.status(200).json({ message: 'Log deleted successfully' });
        } catch (error) {
            console.error('Error deleting glucose log:', error);
            return res.status(500).json({ error: 'Failed to delete glucose log' });
        }
    }
};

module.exports = logController;
