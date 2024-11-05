import React from 'react';
import ProfileCard from '../components/profileCard';
import BlogCard from '../components/BlogCard';
import styles from './pages.module.css';

const MyAccount = () => {

    return (
        <div className={styles.myAccount}>
            <ProfileCard />
            <BlogCard />
        </div>

    );
}
export default MyAccount;