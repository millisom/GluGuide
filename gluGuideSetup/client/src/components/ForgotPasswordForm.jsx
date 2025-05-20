import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/LoginForm.module.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const response = await axiosInstance.post('/forgotPassword', { email });
      setNotification({ message: response.data.message, type: 'success' });
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <p className={styles.pageDescription}>
        Enter your registered email address below, and we'll send you a password reset link.
      </p>
      <form onSubmit={handleSubmit} className={styles.formLogIn}>
      <h1 className={styles.pageTitle}>Forgot Password</h1>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className={`${styles.input} ${styles.mt}`}
        />
        <div className={styles.buttonGroup}>
          <button type="submit" disabled={isLoading} className={`${styles.button} ${styles.mt}`}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>
      </form>
      {notification.message && (
        <p
          className={
            notification.type === 'error' ? styles.errorMessage : styles.successMessage
          }
        >
          {notification.message}
        </p>
      )}
    </div>
  );
};

export default ForgotPasswordForm;