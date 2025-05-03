const cron = require('node-cron');
const alertController = require('../controllers/alertController');


cron.schedule('*/5 * * * *', () => {
    console.log('Running scheduled task: Sending reminder emails...');
    alertController.sendReminderEmails();
  });