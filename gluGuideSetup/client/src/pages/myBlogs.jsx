import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import styles from '../styles/pages.module.css';
import axiosInstance from '../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axiosInstance.get('/getUserPost', {
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
        <div className={styles.buttonWrapper}>
            <button 
                className={styles.cardButton} 
                onClick={() => navigate('/create/post')} 
                aria-label="Create a new post"
            >
                <FontAwesomeIcon icon={faPlus} /> Create new post
            </button>
        </div>

        <div className={styles.blogCardContainer}>
            {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
            ))}
        </div>
    </div>
    );
};

export default MyBlogs;
