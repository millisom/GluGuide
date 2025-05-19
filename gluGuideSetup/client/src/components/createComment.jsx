import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../api/axiosConfig';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../styles/Comments.module.css';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const CreateComment = ({ postId, onCommentCreated, hasExistingComments }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchSessionStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/status`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            setIsLoggedIn(data.valid);
        } else {
            console.error("Error fetching session status, response not OK:", response.status);
            setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error fetching session status:", err);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchSessionStatus();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const plainText = content.replace(/<[^>]+>/g, '').trim();
    if (!plainText) {
      setError("Comment cannot be empty");
      setSuccessMessage("");
      return;
    }

    try {
      await axiosInstance.post(
        "/comments",
        { post_id: postId, content },
        { withCredentials: true }
      );
      setContent("");
      setSuccessMessage("Comment added successfully!");
      setError("");
      if (onCommentCreated) onCommentCreated();
    } catch (error) {
      console.error("Error creating comment:", error);
      setError("Failed to add comment. Please try again.");
      setSuccessMessage("");
    }
  };

  if (authLoading) {
    return <p className={styles.loadingMessage}>Loading commenting section...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.loggedOutCommentPrompt}>
        {hasExistingComments ? (
          <p>
            Please <Link to="/login" className={styles.authLink}>login</Link> or {' '}
            <Link to="/signUp" className={styles.authLink}>create an account</Link> to add a comment and be part of this discussion.
          </p>
        ) : (
          <p>
            Please <Link to="/login" className={styles.authLink}>login</Link> or {' '}
            <Link to="/signUp" className={styles.authLink}>create an account</Link> to be the first one to comment!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.addCommentContainer}>
      <h3 className={styles.title}>Add a Comment</h3>
      <form onSubmit={handleSubmit} className={styles.addCommentForm}>
        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          className={styles.commentTextarea}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, false] }],
              ['bold', 'italic', 'underline','strike', 'blockquote'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link'],
              ['clean']
            ]
          }}
        />
        <button type="submit" className={styles.submitButton}>
          Submit Comment
        </button>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      </form>
    </div>
  );
};

CreateComment.propTypes = {
  postId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onCommentCreated: PropTypes.func.isRequired,
  hasExistingComments: PropTypes.bool,
};

CreateComment.defaultProps = {
    hasExistingComments: true,
};

export default CreateComment;
