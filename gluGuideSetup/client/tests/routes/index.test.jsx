import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AppRoutes from '../../src/routes';

// Mock all route modules
vi.mock('../../src/routes/routeModules/basicRoutes', () => ({
  basicRoutes: [
    { path: '/', element: () => <div>Home Page</div> }
  ]
}));

vi.mock('../../src/routes/routeModules/authRoutes', () => ({
  authRoutes: [
    { path: '/login', element: () => <div>Login Page</div> }
  ]
}));

vi.mock('../../src/routes/routeModules/contentRoutes', () => ({
  contentRoutes: [
    { path: '/blog', element: () => <div>Blog Page</div> }
  ]
}));

vi.mock('../../src/routes/routeModules/adminRoutes', () => ({
  adminRoutes: [
    { path: '/admin', element: () => <div>Admin Page</div> }
  ]
}));

vi.mock('../../src/routes/routeModules/healthRoutes', () => ({
  healthRoutes: [
    { path: '/health', element: () => <div>Health Page</div> }
  ]
}));

describe('AppRoutes Component', () => {
  it('renders routes correctly', () => {
    // Render the AppRoutes component within MemoryRouter
    const { container } = render(
      <MemoryRouter>
        <AppRoutes />
      </MemoryRouter>
    );
    
    // Basic verification that the component renders without errors
    expect(container).toBeTruthy();
  });
}); 