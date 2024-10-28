// Implement logic for user sign-up in controllers/authController.js.
const User = require('../models/userModel');

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
    }
  };


module.exports = authController;