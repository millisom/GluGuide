import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import styles from '../styles/LoginForm.module.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/login', values);
      if (response.data.Login) {
        navigate('/account');
        window.location.reload();
      } else {
        setError(response.data.Message || 'Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.pageTitle}>Welcome Back!</h1>
      <p className={styles.pageDescription}>
        Log in to your account and manage your content effortlessly.
      </p>
      <form onSubmit={handleSubmit} className={styles.formLogIn}>
        <label htmlFor="username" className={styles.label}>Username</label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleInput}
          required
          className={styles.input}
          placeholder="Enter your username"
        />
        <label htmlFor="password" className={`${styles.label} ${styles.mt}`}>Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleInput}
          required
          className={styles.input}
          placeholder="Enter your password"
        />
        <div className={`${styles.buttonGroup} ${styles.mt}`}>
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <p className={styles.linkGroup}>
          <Link to="/forgotPassword" className={styles.link}>
            Forgot Password?
          </Link>
          |
          <Link to="/signUp" className={styles.link}>
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;