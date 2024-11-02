//Use Express Router in routes/authRoutes.js to define routes and connect them to the controller.
// this files contains routes related to authentication like signup, login, logout

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/signUp', authController.signUp);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logout);
router.get('/status', authController.getStatus);

module.exports = router;
  