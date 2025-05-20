import { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';
import styles from '../styles/pages.module.css';
import axiosInstance from '../api/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFeatherAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axiosInstance.get('/getUserPost', {
                    withCredentials: true,
                });
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setError('Failed to load your blog posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return <div className={styles.loadingStatePage}>Loading your masterpieces...</div>;
    }

    if (error) {
        return <div className={styles.errorStatePage}>{error}</div>;
    }

    return (
        <div className={styles.myBlogsPageContainer}>
            <header className={styles.myBlogsHeader}>
                <h1 className={styles.myBlogsTitle}>My Blog Posts</h1>
                <button 
                    className={`${styles.cardButton} ${styles.createPostButtonPrimary}`}
                    onClick={() => navigate('/create/post')} 
                    aria-label="Create a new post"
                >
                    <FontAwesomeIcon icon={faPlus} /> Create New Post
                </button>
            </header>

            {blogs.length > 0 ? (
                <div className={styles.myBlogsGrid}>
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            ) : (
                <div className={styles.noPostsMessage}>
                    <FontAwesomeIcon icon={faFeatherAlt} size="3x" className={styles.noPostsIcon} />
                    <h2>Nothing to see here... yet!</h2>
                    <p>You haven&apos;t authored any posts. Click the button above to share your thoughts!</p>
                </div>
            )}
        </div>
    );
};

export default MyBlogs;
