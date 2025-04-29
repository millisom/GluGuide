import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../styles/Comments.module.css';

const CreateComment = ({ postId, onCommentCreated }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/comments",
        { post_id: postId, content },
        { withCredentials: true }
      );
      setContent("");
      setSuccessMessage("Comment added successfully!");
      onCommentCreated();
    } catch (error) {
      console.error("Error creating comment:", error);
      setError("Failed to add comment");
    }
  };

  return (
    <div className={styles.addCommentContainer}>
      <h3 className={styles.title}>Add a Comment</h3>
      <form onSubmit={handleSubmit} className={styles.addCommentForm}>
        <ReactQuill
          value={content}
          onChange={setContent}
          theme="snow"
          className={styles.commentTextarea}
        />
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default CreateComment;
