import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BlogCard.module.css';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/logout', { credentials: 'include' }); // Same as Navbar
            alert('You have been logged out successfully.');
            navigate('/'); // Redirect to the homepage
            window.location.reload(); // Reload the page to reflect logout status
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
