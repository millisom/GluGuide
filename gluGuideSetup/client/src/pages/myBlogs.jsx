import React from 'react';
import BlogCard from '../components/BlogCard';
import styles from './pages.module.css';

const MyBlogs = () => {
    return (
        <div className={styles.myAccount}>
            <div className={styles.blogCardContainer}>
            <BlogCard />
            </div>
        </div>
    );
}

export default MyBlogs;