const setupAuthRoutes = require('../../../config/routeGroups/authRoutes');

// Mocks
jest.mock('../../../routes/authRoutes', () => 'authRoutes');
jest.mock('../../../routes/profileRoutes', () => 'profileRoutes');

describe('Auth Routes Configuration', () => {
  let mockApp;
  let mockRes;
  
  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockApp = {
      use: jest.fn(),
      get: jest.fn()
    };
  });
  
  it('should set up auth and profile routes', () => {
    setupAuthRoutes(mockApp);
    
    // Check that auth routes are set up
    expect(mockApp.use).toHaveBeenCalledWith('/', 'authRoutes');
    expect(mockApp.use).toHaveBeenCalledWith('/', 'profileRoutes');
    
    // Check that the currentUser endpoint is registered
    expect(mockApp.get).toHaveBeenCalledWith('/currentUser', expect.any(Function));
  });
  
  it('should return user ID when session exists', () => {
    setupAuthRoutes(mockApp);
    
    // Get the currentUser handler
    const currentUserHandler = mockApp.get.mock.calls.find(
      call => call[0] === '/currentUser'
    )[1];
    
    // Create a mock request with session
    const mockReq = {
      session: {
        userId: 123
      }
    };
    
    // Call the handler
    currentUserHandler(mockReq, mockRes);
    
    // Check the response
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ userId: 123 });
  });
  
  it('should return 401 when no session exists', () => {
    setupAuthRoutes(mockApp);
    
    // Get the currentUser handler
    const currentUserHandler = mockApp.get.mock.calls.find(
      call => call[0] === '/currentUser'
    )[1];
    
    // Create a mock request without session
    const mockReq = {
      session: null
    };
    
    // Call the handler
    currentUserHandler(mockReq, mockRes);
    
    // Check the response
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not logged in' });
  });
}); 