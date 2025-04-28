const NotificationStrategy = require('./NotificationStrategy');
// const twilioClient = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

class SMSNotificationStrategy extends NotificationStrategy {
  async send(phoneNumber, data) {
    // Placeholder for SMS sending logic using Twilio
    // return twilioClient.messages.create({
    //   body: data.message,
    //   from: TWILIO_NUMBER,
    //   to: phoneNumber
    // });
  }
}

module.exports = SMSNotificationStrategy;
