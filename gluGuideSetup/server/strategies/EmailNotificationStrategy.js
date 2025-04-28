const NotificationStrategy = require('./NotificationStrategy');
const nodemailer = require('nodemailer');

class EmailNotificationStrategy extends NotificationStrategy {
  async send(email, data) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: data.subject,
      text: data.message,
    };

    return transporter.sendMail(mailOptions);
  }
}

module.exports = EmailNotificationStrategy;
