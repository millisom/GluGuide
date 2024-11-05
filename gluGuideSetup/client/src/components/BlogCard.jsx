import styles from './Blogcard.module.css';
import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig'; 
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import Button from './Button.jsx';
import editPost from './editPost.jsx';


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

        return (
            <div>
                <h1>Posts</h1>
            <section className={styles.card}>
              <div className={styles.cardBody}>
                {posts.map((post) => (
                  <div key={post.id}>
                    <div className={styles.cardContent}>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                      <p>{parse(post.content)}</p>
                      <div className={styles.buttonWrapper}>
                        <button
                          className={styles.cardButton}
                          onClick={() => navigate(`/editPost/${post.id}`)}
                          aria-label={`Edit post titled ${post.title}`}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.cardButton}
                          onClick={() => navigate(`/deletePost/${post.id}`)}
                          aria-label={`Delete post titled ${post.title}`}
                        >
                          Delete
                        </button>
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