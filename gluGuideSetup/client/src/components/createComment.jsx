import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../styles/Comments.module.css';

const CreateComment = ({ postId, onCommentCreated }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();


    const plainText = content.replace(/<[^>]+>/g, '').trim();
    if (!plainText) {
      setError("Comment cannot be empty");
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
      setError(""); // Clear any previous error
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
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      </form>
    </div>
  );
};

export default CreateComment;
