/// Implement logic for user sign-up in controllers/authController.js.
const User = require('../models/authModel');
const argon2 = require('argon2');
const pool = require('../config/db');
const NotificationContext = require('../strategies/NotificationContext');
const EmailNotificationStrategy = require('../strategies/EmailNotificationStrategy');
const { generateResetToken } = require('../helpers/tokenHelper');
const { createPasswordResetMessage } = require('../helpers/messageHelper');

const authController = {
  async signUp(req, res) {
    const { username, email, password, termsAccepted } = req.body;

    try {
      const existingUser = await User.findUserByEmail(email);
      if (existingUser) {
        return res.json("exists");
      }

      const newUser = await User.createUser(username, email, password, termsAccepted);
      res.json("notexist");
    } catch (error) {
      console.error("Error in sign-up process:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
    
  // functions for login and logout and checking session status
  async loginUser(req, res) {
    try {
      console.log("Received login request with body:", req.body);
      const { username, password } = req.body;
      const results = await User.getUserByUsername(username);
  
      if (results.rows.length > 0) {
        const user = results.rows[0];
        console.log("User found:", user);
  
        const validPassword = await argon2.verify(user.password_hash, password);
        if (validPassword) {
          console.log("Password verified successfully");
  
          req.session.username = user.username;
          req.session.userId = user.id;
  
          // Log to confirm
          console.log("Session after setting userId:", req.session);
  
          return res.json({ Login: true });
        } else {
          console.log("Password verification failed");
          return res.json({ Login: false, Message: 'Invalid username or password' });
        }
      } else {
        console.log("No user found with the provided username");
        return res.json({ Login: false, Message: 'Invalid username or password' });
      }
    } catch (err) {
      console.error("An error occurred during login:", err);
      res.status(500).json({ Message: 'An error occurred: ' + err.message, Stack: err.stack });
    }
  },    

  async logout(req, res) {
    try {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ error: 'Failed to log out. Please try again.' });
            }
            res.clearCookie('connect.sid', { path: '/' }); // Clear the session cookie
            return res.redirect('/'); // Redirect to the homepage
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error during logout' });
    }
  },

  async getStatus(req, res) {
    if (req.session.username) {
      const result = await pool.query('SELECT is_admin FROM users WHERE username = $1', [req.session.username]);
      const is_admin = result.rows[0]?.is_admin || false;
      return res.json({ valid: true, username: req.session.username, is_admin });
    } else {
      return res.json({ valid: false });
    }
  },

  async forgotPasswordRequest(req, res) {
    try {
      const { email } = req.body;
  
      const user = await User.forgotPassword(email);
      if (user.rows.length === 0) {
        return res.status(404).json({ message: "User does not exist" });
      }
  
      const { token, expiry } = generateResetToken();
      await User.passwordToken(token, expiry, email);
  
      const frontendURL = 'http://localhost:5173';
      const resetLink = `${frontendURL}/resetPassword/${token}`;
  
      const notificationContext = new NotificationContext(new EmailNotificationStrategy());
      const notificationData = createPasswordResetMessage(resetLink);
  
      await notificationContext.send(email, notificationData);
  
      res.status(200).json({ message: 'Password reset email sent' });
      
    } catch (error) {
      console.error('Error in forgot password request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async passwordReset(req, res) {
    const { token, newPassword } = req.body;

    try {
      const tokenResult = await User.verifyResetToken(token);
      if (tokenResult.rows.length === 0) {
        return res.status(404).json({ message: 'Invalid or expired token' });
      }
      const user = tokenResult.rows[0];
      const username = user.username;
      const expiry = user.password_reset_expires;
      if (Date.now() > new Date(expiry).getTime()) {
        return res.status(404).json({ message: 'Token expired' });
      }
      const hashedPassword = await argon2.hash(newPassword);
      await User.updatePassword(username, hashedPassword);
      await User.clearResetToken(username);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

};


module.exports = authController;