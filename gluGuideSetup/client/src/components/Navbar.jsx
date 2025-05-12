import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/NavBar.module.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch session status to determine if the user is logged in
        const fetchSessionStatus = async () => {
            const response = await fetch('http://localhost:8080/status', { credentials: 'include' });
            const data = await response.json();
            setIsLoggedIn(data.valid);
            setIsAdmin(data.is_admin);
        };

        fetchSessionStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/logout', { credentials: 'include' });
            setIsLoggedIn(false); // Update login state
            alert('You have been logged out successfully.');
            navigate('/'); // Redirect to homepage
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Failed to log out. Please try again.');
        }
    };

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>GluGuide</Link>
            <nav className={styles.navbar}>
                <Link to="/">Home</Link>
                {isLoggedIn ? (
                    <>
                        {isAdmin && (
                            <Link to="/admin">Admin Dashboard</Link>
                        )}
                        <Link to="/account">My Account</Link>
                        <Link to="/myBlogs">My Blogs</Link>
                        <Link className={styles.navLink} onClick={handleLogout}>Logout</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signUp">Sign Up</Link>
                    </>
                )}
                <Link to="/blogs">Blogs</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
        </header>
    );
};

export default Navbar;