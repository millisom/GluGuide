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
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/getUserPost/${id}`, {
                withCredentials: true,
            });
            console.log('Fetched post data:', response.data);  // Log the full response
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

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/toggleLike/${id}`, {}, { withCredentials: true });
      setPost(prevPost => ({
        ...prevPost,
        likes: response.data.likesCount ? Array(response.data.likesCount).fill('user') : []
      }));
      setInfoMessage(''); // Clear any previous message
    } catch (error) {
      if (error.response && error.response.data.message) {
        setInfoMessage(error.response.data.message);
      } else {
        console.error('Error liking post:', error);
      }
    }
  };

  if (!post) {
    return <p className={styles.loadingMessage}>Loading...</p>; // Apply loading message styling
  }

  return (
    <div className={styles.viewPostContainer}>
      {post ? (
        <div className={styles.contentRectangle}>  {/* Wrap all content with a rectangle */}
          <h2 className={styles.postTitle}>{post.title}</h2>
          <p className={styles.authorInfo}>Author: {post.username}</p>
          <p className={styles.postDate}>
            Created on: {new Date(post.created_at).toLocaleDateString()}
          </p>
          {post.updated_at && (
            <p><strong>Last Edited:</strong> {new Date(post.updated_at).toLocaleString()}</p>
          )}
          <div className={styles.postContainerBody}>
            {post.post_picture && (
              <img
                src={`http://localhost:8080/uploads/${post.post_picture}`}
                alt="Blog post"
                className={styles.image}
              />
            )}
            <div className={styles.postContainerContentBox}>
              {parse(post.content)}
            </div>
          </div>
          <button onClick={handleLike}>{`Like (${post.likes ? post.likes.length : 0})`}</button>
          {infoMessage && <p style={{ color: 'orange' }}>{infoMessage}</p>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {error && <p>{error}</p>}
      <CreateComment />
      <FetchComment />
    </div>
  );
};

export default ViewPost;
