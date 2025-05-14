import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BlogCard.module.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, { credentials: 'include' });
      alert('You have been logged out successfully.');
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <button className={styles.squareButton} onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
