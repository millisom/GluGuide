import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ViewBlogEntries.module.css';

const ViewBlogEntries = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate for programmatic routing

  // Fetch all posts when the component loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getAllPosts', {
          withCredentials: true
        });
        
        // Sort posts by creation time, most recent first
        const sortedPosts = response.data?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedPosts || []);
      } catch (error) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', error.response ? error.response.data : error.message);
      }
    };
    fetchPosts();
  }, []);

  // Handler for viewing a post
  const handleViewClick = (postId) => {
    navigate(`/blogs/view/${postId}`); // Navigate to the view page for the selected post
  };

  return (
    <div className={styles.viewBlogEntries}>
      <h2>All Blog Entries</h2>
      {posts.length === 0 ? (
        <p className={styles.noPostsFound}>No posts found.</p>
      ) : (
        <div className={styles.postContainer}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <h4 
                onClick={() => handleViewClick(post.id)} 
                className={styles.postTitle}
              >
                {post.title}
              </h4>
              <p className={styles.postInfo}>Author: {post.username}</p>
              <p className={styles.postInfo}>Created on: {new Date(post.created_at).toLocaleDateString('en-US')}</p>
              <p className={styles.postLikes}><strong>Likes:</strong> {post.likes ? post.likes.length : 0}</p>
            </div>
          ))}
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ViewBlogEntries;
