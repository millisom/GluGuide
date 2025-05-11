const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const setUserIdInSession = require('../middleware/sessionMiddleware');

const setupMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cookieParser());
  
  // Common middleware
  app.use(setUserIdInSession);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error Stack:', err.stack);
    console.log('Request URL:', req.originalUrl);
    res.status(500).send('Something broke!: ' + err.message);
    next();
  });

  app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    next();
  });
};

module.exports = setupMiddleware; 