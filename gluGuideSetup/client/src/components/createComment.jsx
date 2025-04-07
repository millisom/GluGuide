import { useState } from 'react';
import axios from 'axios';
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
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Write your comment here..."
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
