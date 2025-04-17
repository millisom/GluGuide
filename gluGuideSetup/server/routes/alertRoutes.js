const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.post('/alerts', alertController.createAlert);
router.get('/alerts/:userId', alertController.getAlertsByUserId);
router.put('/alerts/:id', alertController.updateAlert);
router.delete('/alerts/:id', alertController.deleteAlert);
router.get('/alerts/due', alertController.sendReminderEmails);
router.get('/alerts/me', alertController.getAlertsForCurrentUser);


module.exports = router;
