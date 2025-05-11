const setupMiddleware = require('../../config/middlewareConfig');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Mock dependencies
jest.mock('body-parser', () => ({
  json: jest.fn(() => 'jsonMiddleware'),
  urlencoded: jest.fn(() => 'urlencodedMiddleware')
}));

jest.mock('cookie-parser', () => jest.fn(() => 'cookieParserMiddleware'));

describe('Middleware Configuration', () => {
  let mockApp;
  
  beforeEach(() => {
    mockApp = {
      use: jest.fn()
    };
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  it('should apply all required middleware to the app', () => {
    setupMiddleware(mockApp);
    
    // Check body-parser is configured properly
    expect(bodyParser.json).toHaveBeenCalled();
    expect(bodyParser.urlencoded).toHaveBeenCalledWith({ extended: true });
    
    // Check cookie-parser is configured
    expect(cookieParser).toHaveBeenCalled();
    
    // Check middleware is applied to app
    expect(mockApp.use).toHaveBeenCalledWith('jsonMiddleware');
    expect(mockApp.use).toHaveBeenCalledWith('urlencodedMiddleware');
    expect(mockApp.use).toHaveBeenCalledWith('cookieParserMiddleware');
    
    // Verify number of middleware applied
    expect(mockApp.use).toHaveBeenCalledTimes(3);
  });
}); 