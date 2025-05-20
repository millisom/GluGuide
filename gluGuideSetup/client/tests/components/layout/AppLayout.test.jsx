import React from 'react';
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

// Mock style module
vi.mock('../../../src/components/layout/AppLayout.module.css', () => ({
  default: {
    container: 'container',
    main: 'main'
  }
}), { virtual: true });

// ✅ Correct async Suspense setup
const createAsyncComponent = () => {
  let resolve;
  const promise = new Promise((r) => {
    resolve = () => r({ default: () => <div data-testid="lazy-loaded">Lazy Loaded</div> });
  });

  const LazyComponent = React.lazy(() => promise);

  return { AsyncComponent: LazyComponent, resolve };
};

describe('AppLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {}); // suppress React Suspense warnings
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

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders loading component when Suspense is triggered', async () => {
    const { AsyncComponent, resolve } = createAsyncComponent();

    render(
      <AppLayout>
        <AsyncComponent />
      </AppLayout>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      await resolve();
    });

    expect(await screen.findByTestId('lazy-loaded')).toBeInTheDocument();
  });

  it('renders correctly without children', () => {
    render(<AppLayout />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('maintains proper structure with flex layout', () => {
    render(<AppLayout />);
    const outerDiv = screen.getByRole('main').parentElement;
    expect(outerDiv).toHaveStyle('display: flex');
    expect(outerDiv).toHaveStyle('flex-direction: column');
    expect(outerDiv).toHaveStyle('min-height: 100vh');

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
            <div data-testid="level-3">Level 3 Text</div>
          </div>
        </div>
      </AppLayout>
    );

    expect(screen.getByText('Level 1 Text')).toBeInTheDocument();
    expect(screen.getByText('Level 2 Text')).toBeInTheDocument();
    expect(screen.getByText('Level 3 Text')).toBeInTheDocument();
  });

  it('wraps children in Suspense for lazy loading', () => {
    render(
      <AppLayout>
        <div data-testid="lazy-child">Test Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId('lazy-child')).toBeInTheDocument();
  });

  it('handles multiple children correctly', () => {
    render(
      <AppLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </AppLayout>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('shows loading component only when children are suspended', () => {
    const { AsyncComponent } = createAsyncComponent();

    render(
      <AppLayout>
        <AsyncComponent />
      </AppLayout>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
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

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      await resolve();
    });

    expect(await screen.findByTestId('lazy-loaded')).toBeInTheDocument();
  });
});
