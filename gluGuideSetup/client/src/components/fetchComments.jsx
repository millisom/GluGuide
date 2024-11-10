
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Comments.module.css';

const CommentsList = () => {
  const { id: post_id } = useParams();
  const [comments, setComments] = useState([]);
  
  const [currentUserId, setCurrentUserId] = useState([]);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/comments/${post_id}`, {
          withCredentials: true,
        });
        setComments(response.data.comments);
        console.log(response.data)
        setCurrentUserId(response.data.currentUserId); 

      } catch (error) {
        console.error('Error loading comments:', error);
        setError('Failed to load comments');
      }
    };

    fetchComments();
  }, [post_id]);
    // Handle delete comment
    const handleDelete = async (commentId) => {
      try {
        await axios.delete(`http://localhost:8080/comments/${commentId}`, {
          withCredentials: true,
        });
        // Remove the deleted comment from the state
        setComments(comments.filter((comment) => comment.id !== commentId));
      } catch (error) {
        console.error('Error deleting comment:', error);
        setError('Failed to delete comment');
      }
    };

  return (
    <div className={styles.commentsContainer}>
      <h3 className={styles.title}>Comments</h3>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.commentsList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <p><strong>Author:</strong> {comment.username}</p>
              <p>{comment.content}</p>
              <p><small>{new Date(comment.created_at).toLocaleString()}</small></p>
              {currentUserId === comment.author_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsList;
