// controllers/alertController.js
const Alert = require('../models/alertModel'); // Assuming you have an Alert model defined
const nodemailer = require('nodemailer');

// Set alert preferences
exports.setAlertPreferences = async (req, res) => {
  const { userId, email, reminderFrequency, reminderTime } = req.body;

  try {
    const alert = await Alert.create({ userId, email, reminderFrequency, reminderTime });
    res.status(201).json({ message: 'Alert preferences saved!', alert });
  } catch (error) {
    res.status(500).json({ message: 'Error saving alert preferences', error });
  }
};

// Send reminder emails
exports.sendReminderEmails = async () => {
  try {
    const alerts = await Alert.findAll(); // Get all alerts (you can add filters for specific conditions)

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
  } catch (error) {
    console.error('Error sending reminder emails:', error);
  }
};
