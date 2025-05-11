import { expect, describe, it, vi } from 'vitest';

// Mock React's lazy loading
vi.mock('react', () => ({
  lazy: fn => fn,
}));

// Mock the imported components
vi.mock('../../../src/pages/homepage.jsx', () => ({ default: 'HomePage' }));
vi.mock('../../../src/pages/contactUs.jsx', () => ({ default: 'ContactUs' }));
vi.mock('../../../src/pages/aboutUs.jsx', () => ({ default: 'AboutUs' }));

// Import the routes after mocking the dependencies
import { basicRoutes } from '../../../src/routes/routeModules/basicRoutes';

describe('basicRoutes', () => {
  it('should export an array of routes', () => {
    expect(Array.isArray(basicRoutes)).toBe(true);
    expect(basicRoutes.length).toBe(3);
  });

  it('should contain the correct paths', () => {
    const paths = basicRoutes.map(route => route.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/contact');
    expect(paths).toContain('/about');
  });

  it('should have the correct route elements', () => {
    const routeMap = basicRoutes.reduce((acc, route) => {
      acc[route.path] = route.element;
      return acc;
    }, {});

    // Verify the functions exist
    expect(typeof routeMap['/']).toBe('function');
    expect(typeof routeMap['/contact']).toBe('function');
    expect(typeof routeMap['/about']).toBe('function');
  });
}); 