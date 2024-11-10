import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import styles from './pages.module.css';
import axios from 'axios';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/getUserPost', {
                    withCredentials: true,
                });
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className={styles.myAccount}>
            <div className={styles.blogCardContainer}>
                {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>
        </div>
    );
};

export default MyBlogs;
