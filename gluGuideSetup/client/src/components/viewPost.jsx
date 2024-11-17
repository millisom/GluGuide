import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import CreateComment from './createComment';
import FetchComment from './fetchComments';
import styles from '../styles/SingleBlog.module.css';

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

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

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/toggleLike/${id}`, {}, { withCredentials: true });
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likesCount ? Array(response.data.likesCount).fill('user') : [],
      }));
      setInfoMessage('');
    } catch (error) {
      if (error.response?.data.message) {
        setInfoMessage(error.response.data.message);
      } else {
        console.error('Error liking post:', error);
      }
    }
  };

  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (!post) return <p className={styles.loadingMessage}>Loading...</p>;

  return (
    <div className={styles.viewPostContainer}>
      <div className={styles.contentRectangle}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <p className={styles.authorInfo}>Author: {post.username}</p>
        <p className={styles.postDate}>
          Created on: {new Date(post.created_at).toLocaleDateString()}
        </p>
        {post.updated_at && (
          <p className={styles.postDate}>
            Last Edited: {new Date(post.updated_at).toLocaleString()}
          </p>
        )}
        <div className={styles.postContainerBody}>
          {post.post_picture && (
            <img
            src={`http://localhost:8080/uploads/${post.picture}`} // Ensure the correct path to the image
              alt="Blog post"
              className={styles.image}
            />
          )}
          <div className={styles.postContainerContentBox}>{parse(post.content)}</div>
        </div>
        <button onClick={handleLike} className={styles.likeButton}>
          ❤️ {post.likes ? post.likes.length : 0} Like{post.likes?.length !== 1 && 's'}
        </button>
        {infoMessage && <p className={styles.infoMessage}>{infoMessage}</p>}
      </div>
      <CreateComment />
      <FetchComment />
    </div>
  );
};

export default ViewPost;
