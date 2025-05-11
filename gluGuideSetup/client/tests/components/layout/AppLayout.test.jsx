import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AppLayout from '../../../src/components/layout/AppLayout';

// Mock the Navbar and Footer components
vi.mock('../../../src/components/Navbar.jsx', () => ({
  default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('../../../src/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

// Mock style module to avoid CSS issues
vi.mock('../../../src/components/layout/AppLayout.module.css', () => ({
  default: {
    container: 'container',
    main: 'main'
  }
}), { virtual: true });

describe('AppLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
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
  
  it('renders correctly without children', () => {
    render(<AppLayout />);
    
    // Check that the layout components are rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // Main content should be empty but present
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement.children.length).toBe(0);
  });
  
  it('maintains proper structure with flex layout', () => {
    const { container } = render(<AppLayout />);
    
    // Get the outer div which should have display: flex
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveStyle('display: flex');
    expect(outerDiv).toHaveStyle('flex-direction: column');
    expect(outerDiv).toHaveStyle('min-height: 100vh');
    
    // Main content should have flex: 1
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveStyle('flex: 1');
  });
  
  it('renders complex nested children correctly', () => {
    render(
      <AppLayout>
        <div data-testid="level-1">
          <p>Level 1 Text</p>
          <div data-testid="level-2">
            <p>Level 2 Text</p>
            <div data-testid="level-3">
              Level 3 Text
            </div>
          </div>
        </div>
      </AppLayout>
    );
    
    // Check that all nested children are rendered
    expect(screen.getByTestId('level-1')).toBeInTheDocument();
    expect(screen.getByTestId('level-2')).toBeInTheDocument();
    expect(screen.getByTestId('level-3')).toBeInTheDocument();
    expect(screen.getByText('Level 1 Text')).toBeInTheDocument();
    expect(screen.getByText('Level 2 Text')).toBeInTheDocument();
    expect(screen.getByText('Level 3 Text')).toBeInTheDocument();
  });
  
  it('wraps children in Suspense for lazy loading', () => {
    const { container } = render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );
    
    // There should be a Suspense component between main and the content
    const mainElement = screen.getByRole('main');
    
    // The structure should be main > Suspense > div
    expect(mainElement.children.length).toBe(1); // Suspense
    expect(mainElement.children[0].children.length).toBe(1); // div
    expect(mainElement.children[0].children[0].textContent).toBe('Test Content');
  });
}); 