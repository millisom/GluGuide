import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../src/App';

// Mock the AppRoutes component
vi.mock('../src/routes', () => ({
  default: () => <div data-testid="app-routes">Mocked Routes</div>
}));

// Mock the AppLayout component
vi.mock('../src/components/layout/AppLayout', () => ({
  default: ({ children }) => (
    <div data-testid="app-layout">
      <div>{children}</div>
    </div>
  )
}));

describe('App Component', () => {
  it('renders AppLayout and AppRoutes', () => {
    render(<App />);
    
    // Check that the layout and routes are rendered
    expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
    expect(screen.getByText('Mocked Routes')).toBeInTheDocument();
  });
}); 