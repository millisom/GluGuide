const setupHealthRoutes = require('../../../config/routeGroups/healthRoutes');

// Mocks
jest.mock('../../../middleware/sessionMiddleware', () => 'sessionMiddleware');
jest.mock('../../../routes/glucoseRoutes', () => 'glucoseRoutes');
jest.mock('../../../routes/foodItemRoutes', () => 'foodItemRoutes');
jest.mock('../../../routes/recipeRoutes', () => 'recipeRoutes');
jest.mock('../../../routes/mealRoutes', () => 'mealRoutes');
jest.mock('../../../routes/alertRoutes', () => 'alertRoutes');

describe('Health Routes Configuration', () => {
  let mockApp;
  
  beforeEach(() => {
    mockApp = {
      use: jest.fn()
    };
  });
  
  it('should set up all health-related routes', () => {
    setupHealthRoutes(mockApp);
    
    // Check that all health routes are set up correctly
    expect(mockApp.use).toHaveBeenCalledWith('/glucose', 'glucoseRoutes');
    expect(mockApp.use).toHaveBeenCalledWith('/food', 'foodItemRoutes');
    expect(mockApp.use).toHaveBeenCalledWith('/recipes', 'sessionMiddleware', 'recipeRoutes');
    expect(mockApp.use).toHaveBeenCalledWith('/meal', 'mealRoutes');
    expect(mockApp.use).toHaveBeenCalledWith('/', 'alertRoutes');
    
    // Check the number of routes
    expect(mockApp.use).toHaveBeenCalledTimes(5);
  });
}); 