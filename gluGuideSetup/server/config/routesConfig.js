/**
 * Main routes configuration that delegates to specialized route group modules
 */
const setupAuthRoutes = require('./routeGroups/authRoutes');
const setupContentRoutes = require('./routeGroups/contentRoutes');
const setupHealthRoutes = require('./routeGroups/healthRoutes');

/**
 * Initialize all application routes
 * @param {Object} app - Express app instance
 */
const setupRoutes = (app) => {
  // Setup route groups
  setupAuthRoutes(app);
  setupContentRoutes(app);
  setupHealthRoutes(app);
};

module.exports = setupRoutes; 