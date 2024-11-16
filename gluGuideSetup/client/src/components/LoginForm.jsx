import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import styles from '../styles/LoginForm.module.css';


const LoginForm = () => {
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
        window.location.reload(); // Reload the page to reflect login status
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
    <form onSubmit={handleSubmit} className={styles.formLogIn}>
      <label className={styles.label}>Username
        <input
          type="text"
          name="username"
          onChange={handleInput}
          required
          className={styles.input}
        />
      </label>
      <label className={styles.label}>Password
        <input
          type="password"
          name="password"
          onChange={handleInput}
          required
          className={styles.input}
        />
      </label>
      <div className={styles.buttonGroup}>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <p className={styles.linkGroup}>
        <Link to="/forgotPassword" className={styles.link}>Forgot Password?</Link>
        <Link to="/signUp" className={styles.link}>Sign up here</Link>
      </p>
    </form>
  );
};

export default LoginForm;