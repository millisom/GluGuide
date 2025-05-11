const express = require('express');
const cors = require('cors');

// Mocks
jest.mock('express', () => {
  const mockApp = {
    use: jest.fn(),
    listen: jest.fn((port, callback) => {
      callback();
      return { close: jest.fn() };
    }),
  };
  return jest.fn(() => mockApp);
});

jest.mock('cors', () => jest.fn(() => 'corsMiddleware'));
jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../config/corsConfig', () => ({ origin: ['http://localhost:5173'] }));
jest.mock('../config/sessionConfig', () => jest.fn());
jest.mock('../config/middlewareConfig', () => jest.fn());
jest.mock('../config/routesConfig', () => jest.fn());

describe('Server', () => {
  let consoleLogSpy;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });
  
  afterEach(() => {
    // Restore console.log
    consoleLogSpy.mockRestore();
  });
  
  it('should set up the server correctly', () => {
    // Run the server code
    require('../server');
    
    // Get the mock app instance
    const mockApp = express();
    
    // Check that all middleware and configs are applied
    expect(cors).toHaveBeenCalledWith(expect.any(Object));
    expect(mockApp.use).toHaveBeenCalledWith('corsMiddleware');
    
    // Check that session config is applied
    const sessionConfig = require('../config/sessionConfig');
    expect(sessionConfig).toHaveBeenCalledWith(mockApp);
    
    // Check that middleware config is applied
    const setupMiddleware = require('../config/middlewareConfig');
    expect(setupMiddleware).toHaveBeenCalledWith(mockApp);
    
    // Check that routes config is applied
    const setupRoutes = require('../config/routesConfig');
    expect(setupRoutes).toHaveBeenCalledWith(mockApp);
    
    // Check that server listens on correct port
    expect(mockApp.listen).toHaveBeenCalledWith(8080, expect.any(Function));
    
    // Check console.log is called with server running message
    expect(consoleLogSpy).toHaveBeenCalledWith('Server is running on http://localhost:8080');
  });
}); 