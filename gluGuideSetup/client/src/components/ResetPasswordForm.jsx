import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import styles from '../styles/LoginForm.module.css';


const ResetPasswordForm = () => {
  const { token } = useParams(); // Retrieve the token from the URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setNotification({ message: '', type: '' });

    if (newPassword !== confirmPassword) {
      setNotification({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8080/resetPassword', {
        token,
        newPassword,
      });

      setNotification({ message: response.data.message, type: 'success' });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
    <form onSubmit={handlePasswordReset} className={styles.formLogIn}>
        <h1 className="pageTitle">Reset Password</h1>
        <div className='inputField'>
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className={styles.input}
          placeholder='New Password'
        />
        </div>
        <div className='inputField'>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
          placeholder='Confirm Password'
        />
        </div>
      <div className={styles.buttonGroup}>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
      {notification.message && (
        <p className={styles.errorMessage} style={{ color: notification.type === 'error' ? 'red' : 'green' }}>
          {notification.message}
        </p>
      )}
    </form>
  );
};

export default ResetPasswordForm;
