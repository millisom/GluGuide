
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Comments.module.css';

const CreateComment = () => {
  const { id: post_id } = useParams();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/comments',
        { post_id, content },
        { withCredentials: true }
      );

      console.log('Comment created:', response.data);
      setContent('');
      setSuccessMessage('Comment added successfully!');
    } catch (error) {
      console.error('Error creating comment:', error.response ? error.response.data : error.message);
      setError('Failed to add comment');
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <h3 className={styles.title}>Add a Comment</h3>
      <form onSubmit={handleSubmit} className={styles.addCommentForm}>
        <label className={styles.label}>Comment:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className={styles.commentTextarea}
        />
        <button type="submit" className={styles.submitButton}>Submit Comment</button>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default CreateComment;
