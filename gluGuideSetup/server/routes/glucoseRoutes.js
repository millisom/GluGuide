const express = require('express');
const router = express.Router();
const glucoseController = require('../controllers/glucoseController'); // Import your glucose controller

// Route to log a new glucose entry
router.post('/log', glucoseController.logGlucose);

// Route to retrieve all glucose logs for a user
router.get('/:userId', glucoseController.getUserGlucoseLogs);

// Route to retrieve logs for a specific time period (new feature)
router.get('/:userId/time-period', glucoseController.getGlucoseLogsByTimePeriod);

// Route to retrieve a specific glucose log by ID
router.get('/log/:id', glucoseController.getGlucoseLogById);

// Route to update a glucose log by ID
router.put('/log/:id', glucoseController.updateGlucoseLog);

// Route to delete a glucose log by ID
router.delete('/log/:id', glucoseController.deleteGlucoseLog);



module.exports = router;