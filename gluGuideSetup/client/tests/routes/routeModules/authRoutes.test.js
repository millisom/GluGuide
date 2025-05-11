import { expect, describe, it, vi } from 'vitest';

// Mock React's lazy loading
vi.mock('react', () => ({
  lazy: fn => fn,
}));

// Mock the imported components
vi.mock('../../../src/pages/login.jsx', () => ({ default: 'LoginPage' }));
vi.mock('../../../src/pages/signUp.jsx', () => ({ default: 'SignUp' }));
vi.mock('../../../src/pages/forgotPassword.jsx', () => ({ default: 'ForgotPassword' }));
vi.mock('../../../src/pages/resetPassword.jsx', () => ({ default: 'ResetPassword' }));
vi.mock('../../../src/pages/myAccount.jsx', () => ({ default: 'MyAccount' }));

// Import the routes after mocking the dependencies
import { authRoutes } from '../../../src/routes/routeModules/authRoutes';

describe('authRoutes', () => {
  it('should export an array of routes', () => {
    expect(Array.isArray(authRoutes)).toBe(true);
    expect(authRoutes.length).toBe(5);
  });

  it('should contain the correct paths', () => {
    const paths = authRoutes.map(route => route.path);
    expect(paths).toContain('/login');
    expect(paths).toContain('/signUp');
    expect(paths).toContain('/forgotPassword');
    expect(paths).toContain('/resetPassword/:token');
    expect(paths).toContain('/account');
  });

  it('should have the correct route elements', () => {
    const routeMap = authRoutes.reduce((acc, route) => {
      acc[route.path] = route.element;
      return acc;
    }, {});

    // Verify the functions exist
    expect(typeof routeMap['/login']).toBe('function');
    expect(typeof routeMap['/signUp']).toBe('function');
    expect(typeof routeMap['/forgotPassword']).toBe('function');
    expect(typeof routeMap['/resetPassword/:token']).toBe('function');
    expect(typeof routeMap['/account']).toBe('function');
  });
}); 