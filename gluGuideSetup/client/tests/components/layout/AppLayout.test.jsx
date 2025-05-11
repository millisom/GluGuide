import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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

// Simple mock component to test Suspense behavior
const createAsyncComponent = () => {
  let resolve;
  const promise = new Promise(r => { resolve = r; });
  
  const AsyncComponent = () => {
    throw promise;
  };
  
  return {
    AsyncComponent,
    resolve: () => {
      resolve();
      return promise;
    }
  };
};

describe('AppLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
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
    const { AsyncComponent, resolve } = createAsyncComponent();
    
    render(
      <AppLayout>
        <AsyncComponent />
      </AppLayout>
    );
    
    // The loading spinner should be visible
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Resolve the suspended component
    await act(async () => {
      await resolve();
    });
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
    render(<AppLayout />);
    
    // Get the outer div which should have display: flex
    const outerDiv = screen.getByRole('main').parentElement;
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
    render(
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
  
  it('handles multiple children correctly', () => {
    render(
      <AppLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </AppLayout>
    );
    
    // All children should be rendered
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });
  
  it('shows loading component only when children are suspended', () => {
    const { AsyncComponent } = createAsyncComponent();
    
    render(
      <AppLayout>
        <div>Regular content</div>
        <AsyncComponent />
      </AppLayout>
    );
    
    // Loading spinner should be visible while AsyncComponent is suspended
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // But regular children should not be visible yet
    expect(screen.queryByText('Regular content')).not.toBeInTheDocument();
  });
  
  it('handles nested Suspense correctly', async () => {
    const { AsyncComponent, resolve } = createAsyncComponent();
    
    render(
      <AppLayout>
        <div>
          <AsyncComponent />
        </div>
      </AppLayout>
    );
    
    // Loading spinner should be visible
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Resolve the suspended component
    await act(async () => {
      await resolve();
    });
  });
}); 