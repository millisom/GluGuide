import styles from '../styles/Blogcard.module.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from '../../api/axiosConfig';

const BlogCard = ({ blog }) => {
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate(`/blogs/view/${blog.id}`);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:8080/deletePost/${blog.id}`, {
                    withCredentials: true,
                });
                alert('Post deleted successfully.');
                window.location.reload(); // Reload to update the state
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post.');
            }
        }
    };

    return (
        <div className={styles.card}>
            {blog.post_picture && (
                <div className={styles.cardImage}>
                    <img src={`http://localhost:8080/uploads/${blog.post_picture}`} alt={blog.title} />
                </div>
            )}
            <div className={styles.cardContent}>
                <h2 className={styles.cardTitle} onClick={handleViewClick}>
                    {blog.title}
                </h2>
                <p className={styles.cardDescription}>
                    {blog.content.length > 150
                        ? parse(`${blog.content.slice(0, 150)}...`)
                        : parse(blog.content)}
                </p>
                <div className={styles.cardFooter}>
                    <p className={styles.postLikes}>
                        ❤️ {blog.likes ? blog.likes.length : 0} Likes
                    </p>
                    <div className={styles.iconContainer}>
                        <button
                            className={styles.iconButton}
                            onClick={() => navigate(`/blogs/edit/${blog.id}`)}
                            aria-label={`Edit post titled ${blog.title}`}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={handleDelete}
                            aria-label={`Delete post titled ${blog.title}`}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
