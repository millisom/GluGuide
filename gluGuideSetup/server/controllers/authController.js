// Implement logic for user sign-up in controllers/authController.js.
const User = require('../models/authModel');

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
        const results = await User.getUserByUsername(req.body.username);
  
        if (results.rows.length > 0) {
          const user = results.rows[0];
          req.session.username = user.username;
          req.session.userId = user.id;
          return res.json({ Login: true });
        } else {
          return res.json({ Login: false });
        }
      } catch (err) {
        console.error("An error occurred during login:", err);
        res.status(500).json({ Message: 'An error occurred: ' + err.message, Stack: err.stack });
      }
    },
    async logout(req, res) {
      try {
        await new Promise((resolve, reject) => {
          req.session.destroy(err => {
            if (err) {
              console.error('Error destroying session:', err);
              return reject(err);
            }
            resolve();
          });
        });
        res.status(200).send('Session destroyed');
      } catch (error) {
        res.status(500).send('Error destroying session');
      }
    },

    async getStatus(req, res) {
      if (req.session.username) {
        return res.json({ valid: true, username: req.session.username });
      } else {
        return res.json({ valid: false });
      }
    }
  };


module.exports = authController;