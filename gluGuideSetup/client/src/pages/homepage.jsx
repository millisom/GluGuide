import React from 'react';
import ViewBlogEntries from "../components/ViewBlogEntries";
import styles from '../styles/Homepage.module.css';

const Homepage = () => {
    return (
        <div className={styles.homepageContainer}>
            <div className={styles.heroSection}>
                <h1 className={styles.title}>Welcome to GluGuide!</h1>
                <p className={styles.description}>
                    GluGuide is your trusted platform to track blood sugar levels and receive
                    personalized recommendations. We’re here to help you manage your gestational
                    diabetes with confidence and ease.
                </p>
            </div>
            <div className={styles.blogSection}>
                <h2 className={styles.subtitle}>Explore Blogs</h2>
                <ViewBlogEntries />
            </div>
        </div>
    );
};

export default Homepage;
