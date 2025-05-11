const setupContentRoutes = require('../../../config/routeGroups/contentRoutes');

// Mocks
jest.mock('express', () => ({
  static: jest.fn(() => 'staticMiddleware')
}));
jest.mock('../../../routes/postRoutes', () => 'postRoutes');
jest.mock('../../../routes/commentRoutes', () => 'commentRoutes');
jest.mock('../../../routes/adminRoutes', () => 'adminRoutes');

describe('Content Routes Configuration', () => {
  let mockApp;
  let mockRes;
  
  beforeEach(() => {
    mockRes = {
      send: jest.fn()
    };
    
    mockApp = {
      use: jest.fn(),
      get: jest.fn()
    };
  });
  
  it('should set up content-related routes', () => {
    setupContentRoutes(mockApp);
    
    // Check that static file serving is set up
    expect(mockApp.use).toHaveBeenCalledWith('/uploads', 'staticMiddleware');
    
    // Check that content routes are set up
    expect(mockApp.use).toHaveBeenCalledWith('/', 'postRoutes');
    expect(mockApp.use).toHaveBeenCalledWith('/', 'commentRoutes');
    expect(mockApp.use).toHaveBeenCalledWith('/', 'adminRoutes');
    
    // Check that the root endpoint is registered
    expect(mockApp.get).toHaveBeenCalledWith('/', expect.any(Function));
  });
  
  it('should respond to root endpoint correctly', () => {
    setupContentRoutes(mockApp);
    
    // Get the root handler
    const rootHandler = mockApp.get.mock.calls.find(
      call => call[0] === '/'
    )[1];
    
    // Create a mock request
    const mockReq = {};
    
    // Call the handler
    rootHandler(mockReq, mockRes);
    
    // Check the response
    expect(mockRes.send).toHaveBeenCalledWith('Welcome to the gluGuide API!');
  });
}); 