const cron = require('node-cron');
const alertController = require('../controllers/alertController');

// Run the email reminder task every day at 8 AM
cron.schedule('0 8 * * *', () => {
    console.log('Running scheduled task: Sending reminder emails...');
    alertController.sendReminderEmails();
  });