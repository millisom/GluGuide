const setupRoutes = require('../../config/routesConfig');

// Mock all route group setups
jest.mock('../../config/routeGroups/authRoutes', () => jest.fn());
jest.mock('../../config/routeGroups/contentRoutes', () => jest.fn());
jest.mock('../../config/routeGroups/healthRoutes', () => jest.fn());

describe('Routes Configuration', () => {
  let mockApp;
  
  beforeEach(() => {
    mockApp = {};
    jest.clearAllMocks();
  });
  
  it('should initialize all route groups', () => {
    const setupAuthRoutes = require('../../config/routeGroups/authRoutes');
    const setupContentRoutes = require('../../config/routeGroups/contentRoutes');
    const setupHealthRoutes = require('../../config/routeGroups/healthRoutes');
    
    setupRoutes(mockApp);
    
    // Verify each route group setup is called with the app
    expect(setupAuthRoutes).toHaveBeenCalledWith(mockApp);
    expect(setupContentRoutes).toHaveBeenCalledWith(mockApp);
    expect(setupHealthRoutes).toHaveBeenCalledWith(mockApp);
    
    // Verify all route groups are called once
    expect(setupAuthRoutes).toHaveBeenCalledTimes(1);
    expect(setupContentRoutes).toHaveBeenCalledTimes(1);
    expect(setupHealthRoutes).toHaveBeenCalledTimes(1);
  });
}); 