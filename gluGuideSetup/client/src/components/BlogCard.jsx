import styles from '../styles/Blogcard.module.css';
import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';


const BlogCard = () => {

    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
              const res = await axios.get('http://localhost:8080/getPosts');
              setPosts(res.data || []);
            } catch (err) {
              console.error('Error fetching posts:', err);
              setError('Failed to fetch posts.');
            }
        };
      
        fetchPosts();
      }, [navigate]);

      const handleDelete = async (id) => {
        console.log("Deleting post with ID:", id); // Add this line
        if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
          try {
            await axios.delete(`http://localhost:8080/deletePost/${id}`, {
              withCredentials: true
            });
            alert('Post deleted successfully.');
            setPosts(posts.filter(post => post.id !== id)); // Update the posts state after deletion
          } catch (error) {
            setError('Failed to delete post');
            console.error('Error deleting post:', error);
          }
        }
    };

        return (
            <div>
            <div className={styles.buttonWrapper}>
            <button 
            className={styles.cardButton} 
            onClick={() => navigate('/create/post')} 
            aria-label="Create a new post"
        >
            <FontAwesomeIcon icon={faPlus} /> Create new post
        </button>

            </div>
            <section className={styles.card}>
              <div className={styles.cardBody}>
                {posts.map((post) => (
                  <div key={post.id}>
                    <div className={styles.cardContent}>
                      <div className={styles.iconContainer}>
                      <button
                          className={styles.icon}
                          onClick={() => navigate(`/blogs/edit/${post.id}`)} // Corrected route
                          aria-label={`Edit post titled ${post.title}`}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className={styles.icon}
                          onClick={() => handleDelete(post.id)} // Pass post.id explicitly
                          aria-label={`Delete post titled ${post.title}`}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        </div>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                      <p>{parse(post.content)}</p>
                      <div className={styles.buttonWrapper}>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            </div>
          );
};
export default BlogCard;