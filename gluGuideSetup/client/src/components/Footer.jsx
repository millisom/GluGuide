import React from 'react';
import styles from '../styles/Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} GluGuide. All rights reserved.</p>
            <nav>
                <a href="/contact">Contact Us</a> | 
                <a href="/about">About Us</a>
            </nav>
        </footer>
    );
};

export default Footer;
