const Log = require('../models/glucoseModel'); // Import your log model

const logController = {

    // Log a new glucose entry
    async logGlucose(req, res) {
        const { userId, date, time, glucoseLevel } = req.body;

        if (!userId || !date || !time || !glucoseLevel) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const newLog = await Log.createLog(userId, date, time, glucoseLevel);
            return res.status(201).json({ success: true, log: newLog });
        } catch (error) {
            console.error('Error logging glucose:', error);
            return res.status(500).json({ error: 'Failed to log glucose entry' });
        }
    },

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
