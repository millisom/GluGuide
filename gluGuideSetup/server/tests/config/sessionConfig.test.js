const sessionConfig = require('../../config/sessionConfig');
const express = require('express');

// Mock express-session
jest.mock('express-session', () => 
  jest.fn(() => (req, res, next) => next())
);

describe('Session Configuration', () => {
  let app;
  
  beforeEach(() => {
    app = express();
    app.use = jest.fn();
  });
  
  it('should apply session middleware to app', () => {
    // Set up environment variable
    process.env.SESSION_SECRET = 'test-secret';
    
    // Apply session config
    sessionConfig(app);
    
    // Check that app.use was called
    expect(app.use).toHaveBeenCalled();
  });
}); 