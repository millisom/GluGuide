import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import axios from '../../api/axiosConfig';
import Login from '../../src/components/login';

// Mock axios
vi.mock('../../api/axiosConfig');

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  it('handles form submission and navigates on success', async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    axios.post.mockResolvedValue({ data: { Login: true } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/login', {
        username: 'testuser',
        password: 'password',
      });
      expect(navigate).toHaveBeenCalledWith('/account');
    });
  });

  it('displays error message on failed login', async () => {
    axios.post.mockResolvedValue({ data: { Login: false, Message: 'Invalid username or password' } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'wrongpassword' } });

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

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('An error occurred. Please try again.')).toBeInTheDocument();
  });

  it('displays loading state during form submission', async () => {
    axios.post.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: { Login: true } }), 1000)));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button', { name: /logging in.../i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /logging in.../i })).not.toBeInTheDocument();
    });
  });
});
