import { describe, it, expect, vi } from 'vitest';
import { contentRoutes } from '../../../src/routes/routeModules/contentRoutes';

// Mock React's lazy
vi.mock('react', () => ({
  lazy: vi.fn(importFn => importFn)
}));

// Mock the lazy-loaded components
vi.mock('../../../src/pages/blogs.jsx', () => ({ default: () => null }));
vi.mock('../../../src/components/viewPost.jsx', () => ({ default: () => null }));
vi.mock('../../../src/components/editPost.jsx', () => ({ default: () => null }));
vi.mock('../../../src/pages/createPost.jsx', () => ({ default: () => null }));
vi.mock('../../../src/pages/myBlogs.jsx', () => ({ default: () => null }));
vi.mock('../../../src/components/UserProfile.jsx', () => ({ default: () => null }));

describe('Content Routes Module', () => {
  it('should export the correct routes', () => {
    // Check that contentRoutes is an array
    expect(Array.isArray(contentRoutes)).toBe(true);
    
    // Check the length of routes
    expect(contentRoutes.length).toBe(7);
    
    // Check specific routes
    expect(contentRoutes).toContainEqual(
      expect.objectContaining({ path: '/blogs' })
    );
    expect(contentRoutes).toContainEqual(
      expect.objectContaining({ path: '/blogs/view/:id' })
    );
    expect(contentRoutes).toContainEqual(
      expect.objectContaining({ path: '/blogs/edit/:id' })
    );
    expect(contentRoutes).toContainEqual(
      expect.objectContaining({ path: '/create/post' })
    );
    expect(contentRoutes).toContainEqual(
      expect.objectContaining({ path: '/myBlogs' })
    );
    expect(contentRoutes).toContainEqual(
      expect.objectContaining({ path: '/viewPost/:id' })
    );
    expect(contentRoutes).toContainEqual(
      expect.objectContaining({ path: '/profile/:username' })
    );
  });
  
  it('should have the correct element properties', () => {
    // Check that each route has an element property
    contentRoutes.forEach(route => {
      expect(route).toHaveProperty('element');
      expect(typeof route.element).toBe('function');
    });
  });
}); 