const express = require('express');
const postRoutes = require('../../routes/postRoutes');
const commentRoutes = require('../../routes/commentRoutes');
const adminRoutes = require('../../routes/adminRoutes');

/**
 * Setup content management routes (blogs, comments, admin features)
 * @param {Object} app - Express app
 */
const setupContentRoutes = (app) => {
  app.use('/uploads', express.static('uploads'));
  app.use('/', postRoutes);
  app.use('/', commentRoutes);
  app.use('/', adminRoutes);
  
  // Root route
  app.get('/', (req, res) => {
    res.send('Welcome to the gluGuide API!');
  });
};

module.exports = setupContentRoutes; 