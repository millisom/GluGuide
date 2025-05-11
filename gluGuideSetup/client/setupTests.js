import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup global React for tests
window.React = React;

// Jest compatibility for tests that use jest directly
window.jest = vi;

// Mock CSS imports
vi.mock('*.css', () => ({}));
vi.mock('*.module.css', () => ({
  default: new Proxy({}, {
    get: (target, prop) => prop
  })
}));

// Mock window related methods and properties that might be missing in the test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup navigation mocks
window.location = {
  href: '',
  pathname: '',
  reload: vi.fn(),
  assign: vi.fn(),
};
