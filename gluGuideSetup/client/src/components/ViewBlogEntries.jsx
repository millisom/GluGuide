import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ViewBlogEntries.module.css';

const ViewBlogEntries = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getAllPosts', {
          withCredentials: true,
        });

        // Sort posts by creation time, most recent first
        const sortedPosts = response.data?.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts || []);
      } catch (error) {
        setError('Failed to fetch posts');
        console.error(
          'Error fetching posts:',
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchPosts();
  }, []);

  // Memoize posts to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => posts, [posts]);

  const handleViewClick = (postId) => {
    navigate(`/blogs/view/${postId}`);
  };

  return (
    <div className={styles.viewBlogEntries}>
      <h2 className={styles.title}>Explore Blog Entries</h2>
      {memoizedPosts.length === 0 ? (
        <p className={styles.noPostsFound}>No posts found.</p>
      ) : (
        <div className={styles.postContainer}>
          {memoizedPosts.map((post) => (
            <div
              key={post.id}
              className={styles.postCard}
              onClick={() => handleViewClick(post.id)}
            >
              {post.post_picture && (
                <div className={styles.postImage}>
                  <img
                    src={`http://localhost:8080/uploads/${post.post_picture}`}
                    alt={post.title}
                    loading="lazy" // Enable lazy loading
                  />
                </div>
              )}
              <h4 className={styles.postTitle}>{post.title}</h4>
              <div className={styles.postDetails}>
                <p className={styles.postInfo}>Author: {post.username}</p>
                <p className={styles.postInfo}>
                  Created on: {new Date(post.created_at).toLocaleDateString('en-US')}
                </p>
                <div className={styles.postLikes}>
                  <span className={styles.likeIcon}>❤️</span>
                  <span>{post.likes ? post.likes.length : 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ViewBlogEntries;
