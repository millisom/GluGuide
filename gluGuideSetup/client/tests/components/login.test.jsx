import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from '../../src/api/axiosConfig';
import Login from '../../src/components/LoginForm';
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';

// Mock axios
vi.mock('../../src/api/axiosConfig');

// Spy for useNavigate
const mockNavigate = vi.fn();

// Mock react-router-dom properly with importActual
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  // Silence console.warn for React Router warning
  const originalWarn = console.warn;
  beforeAll(() => {
    console.warn = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('React Router Future Flag Warning')
      ) return;
      originalWarn(...args);
    };
  });

  afterAll(() => {
    console.warn = originalWarn;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    vi.stubGlobal('location', { reload: vi.fn() });
  });

  it('renders the login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('handles form submission and navigates on success', async () => {
    axios.post.mockResolvedValue({ data: { Login: true } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const username = 'hossaynew';
    const password = '1995';

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: username },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: password },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/login',
        { username, password },
        { withCredentials: true }
      );
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/account');
    });
  });

  it('displays error message on failed login', async () => {
    axios.post.mockResolvedValue({
      data: { Login: false, Message: 'Invalid username or password' },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
  });

  it('displays generic error message on request failure', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'hossaynew' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '1995' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('An error occurred. Please try again.')).toBeInTheDocument();
  });
});
