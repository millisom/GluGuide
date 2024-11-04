import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

      try {
        // Simulate a server error if the username is "triggerError"
        if (values.username === "triggerError") {
          throw new Error("Simulated server error");
        }
      const response = await axios.post('http://localhost:8080/login', values);
      if (response.data.Login) {
        navigate('/account');
      } else {
        setError(response.data.Message || 'Invalid username or password');
      }
      console.log('Response:', response.data);
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:
          <input
            type="text"
            name="username"
            onChange={handleInput}
            required
          />
        </label>
        <label>Password:
          <input
            type="password"
            name="password"
            onChange={handleInput}
            required
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }} data-testid="error-message">{error}</p>}
      <Link to="/forgotPassword">Forgot Password</Link>
    </div>
  );
};

export default Login;
