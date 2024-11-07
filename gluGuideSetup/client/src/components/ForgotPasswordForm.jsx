import React, { useState } from 'react';
import axios from '../../api/axiosConfig';
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
      const response = await axios.post('http://localhost:8080/forgotPassword', { email });
      setNotification({ message: response.data.message, type: 'success' });
    } catch (error) {
      setNotification({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Inline FormInput Component
  const FormInput = ({ label, type, name, value, onChange, required, placeholder }) => (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder || label}
      />
    </div>
  );

  return (
    <div className={styles.formLogIn}>
      <h2 className={styles.title}>Forgot Password</h2>
      <p className={styles.label}>Please enter your email address to receive a password reset link.</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.label}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
            className={styles.input}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? 'Sending...' : 'Request Reset Link'}
          </button>
        </div>
      </form>
      {notification.message && (
        <p className={notification.type === 'error' ? styles.errorMessage : styles.successMessage}>
          {notification.message}
        </p>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
