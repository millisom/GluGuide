import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import CreateComment from './createComment';
import FetchComment from './fetchComments';
import styles from '../styles/SingleBlog.module.css'; // Import CSS module

const ViewPost = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserPost/${id}`, {
          withCredentials: true,
        });
        setPost(response.data || {});
      } catch (error) {
        setError('Failed to load post');
        console.error('Error loading post:', error.response ? error.response.data : error.message);
      }
    };
    fetchPost();
  }, [id]);

  if (error) {
    return <p className={styles.errorMessage}>{error}</p>; // Apply error styling
  }

  if (!post) {
    return <p className={styles.loadingMessage}>Loading...</p>; // Apply loading message styling
  }

  return (
    <div className={styles.viewPostContainer}>
      <div className={styles.postContainer}>
        {post ? (
          <div>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.authorInfo}>Author: {post.username}</p>
            <p className={styles.postDate}>
              Created on: {new Date(post.created_at).toLocaleDateString()}
            </p>
            {post.updated_at && (
              <p>
                <strong>Last Edited:</strong> {new Date(post.updated_at).toLocaleString()}
              </p>
            )}
            <div className={styles.postContainerBody}>
              {post.post_picture && (
                <img
                  src={`http://localhost:8080/uploads/${post.post_picture}`}
                  alt="Blog post"
                  className={styles.image} // Apply image styling
                />
              )}
              <div className={styles.postContainerContentBox}>
                {parse(post.content)} {/* Parsing HTML content */}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.commentsSection}>
        <CreateComment />
        <FetchComment />
      </div>
    </div>
  );
};

export default ViewPost;
