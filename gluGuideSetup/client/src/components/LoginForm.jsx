import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/LoginForm.module.css';
import '../styles/signUp.module.css';

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
      const response = await axiosInstance.post('/login', values, {
        withCredentials: true,
      });
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
      <h1 className="pageTitle">Login</h1>
        <div className='inputField'>
        <input
          type="text"
          name="username"
          id="username"
          onChange={handleInput}
          required
          className={styles.input}
          placeholder="Username"
        />
        </div>
        <div className='inputField'>
        <input
          type="password"
          name="password"
          id="password"
          onChange={handleInput}
          required
          className={styles.input}
          placeholder="Password"
        />
        </div>
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