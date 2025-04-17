const Alert = require('../models/alertModel');
const nodemailer = require('nodemailer');


const alertController = {
  // Create a new alert
  async createAlert(req, res) {
      const { reminderFrequency, reminderTime } = req.body;
      const username = req.session?.username; // Get username from session

      if (!username) {
          return res.status(401).json({ success: false, message: 'Unauthorized: No username found in session' });
      }

      try {
          // Get userId from username via the model
          const userId = await Alert.getUserIdByUsername(username);
          if (!userId) {
              return res.status(404).json({ success: false, message: 'User not found' });
          }

          // Create the alert using userId
          const alert = await Alert.createAlert(userId, reminderFrequency, reminderTime);
          res.status(201).json({ success: true, message: 'Alert preferences saved!', alert });
      } catch (error) {
          console.error('Error creating alert:', error.message);
          res.status(500).json({ success: false, message: 'Failed to save alert preferences' });
      }
  },

    // Get all alerts for a specific user
    async getAlertsByUserId(req, res) {
        const { userId } = req.params;

        try {
            const alerts = await Alert.getAlertsByUserId(userId);
            res.status(200).json(alerts);
        } catch (error) {
            console.error('Error fetching alerts:', error.message);
            res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
        }
    },
    async getAlertsForCurrentUser(req, res) {
      const username = req.session?.username; // Retrieve username from session
  
      if (!username) {
          return res.status(401).json({ success: false, message: 'Unauthorized: No username found in session' });
      }
  
      try {
          // Fetch the user ID
          const userId = await Alert.getUserIdByUsername(username);
          if (!userId) {
              return res.status(404).json({ success: false, message: 'User not found' });
          }
  
          // Fetch alerts by user ID
          const alerts = await Alert.getAlertsByUserId(userId);
          res.status(200).json(alerts);
      } catch (error) {
          console.error('Error fetching alerts for user:', error.message);
          res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
      }
  },
  

    // Update an alert
    async updateAlert(req, res) {
        const { id: alertId } = req.params;
        const { email, reminderFrequency, reminderTime } = req.body;

        try {
            const updatedAlert = await Alert.updateAlert(alertId, email, reminderFrequency, reminderTime);
            if (!updatedAlert) {
                return res.status(404).json({ success: false, message: 'Alert not found' });
            }
            res.status(200).json({ success: true, message: 'Alert updated successfully', alert: updatedAlert });
        } catch (error) {
            console.error('Error updating alert:', error.message);
            res.status(500).json({ success: false, message: 'Failed to update alert' });
        }
    },

    // Delete an alert
    async deleteAlert(req, res) {
        const { id: alertId } = req.params;

        try {
            const deletedRows = await Alert.deleteAlert(alertId);
            if (deletedRows === 0) {
                return res.status(404).json({ success: false, message: 'Alert not found' });
            }
            res.status(200).json({ success: true, message: 'Alert deleted successfully' });
        } catch (error) {
            console.error('Error deleting alert:', error.message);
            res.status(500).json({ success: false, message: 'Failed to delete alert' });
        }
    },

    // Send reminder emails
    async sendReminderEmails(req, res) {
        try {
            const alerts = await Alert.getAlertsDueForSending(); // Fetch due alerts

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER, // Your email
                    pass: process.env.EMAIL_PASS, // Your email password
                },
            });

            for (const alert of alerts) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: alert.email,
                    subject: 'Sugar Log Reminder',
                    text: 'Hi! Just a reminder to log your sugar levels today.',
                };

                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${alert.email}`);
            }

            res.status(200).json({ success: true, message: 'Reminders sent successfully' });
        } catch (error) {
            console.error('Error sending reminder emails:', error.message);
            res.status(500).json({ success: false, message: 'Failed to send reminder emails' });
        }
    },
};

module.exports = alertController;
