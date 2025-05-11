import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AppLayout from '../../../src/components/layout/AppLayout';

// Mock the Navbar and Footer components
vi.mock('../../../src/components/Navbar.jsx', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('../../../src/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

describe('AppLayout Component', () => {
  it('renders correctly with children', () => {
    render(
      <AppLayout>
        <div data-testid="child-content">Test Content</div>
      </AppLayout>
    );
    
    // Check that the layout components are rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // Check that the children are rendered
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders loading component when Suspense is triggered', async () => {
    // Create a component that will trigger Suspense
    const LazyComponent = () => {
      throw Promise.resolve(); // This will trigger Suspense
      // eslint-disable-next-line no-unreachable
      return null;
    };
    
    // Suppress the React act warning that occurs with Suspense
    const originalError = console.error;
    console.error = vi.fn();
    
    try {
      render(
        <AppLayout>
          <LazyComponent />
        </AppLayout>
      );
      
      // The loading spinner should be visible
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    } finally {
      console.error = originalError;
    }
  });
}); 