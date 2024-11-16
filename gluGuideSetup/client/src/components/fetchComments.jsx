import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Comments.module.css';

const CommentsList = () => {
  const { id: post_id } = useParams();
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState([]);
  const [error, setError] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null); // ID of the comment being edited
  const [newContent, setNewContent] = useState(''); // New content for editing

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/comments/${post_id}`, {
          withCredentials: true,
        });
        setComments(response.data.comments);
        setCurrentUserId(response.data.currentUserId);
      } catch (error) {
        console.error('Error loading comments:', error);
        setError('Failed to load comments');
      }
    };

    fetchComments();
  }, [post_id]);

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/comments/${commentId}`, {
        withCredentials: true,
      });
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/comments/${commentId}`,
        { content: newContent },
        { withCredentials: true }
      );

      setComments(comments.map((comment) =>
        comment.id === commentId ? { ...comment, content: response.data.comment.content } : comment
      ));
      setEditingCommentId(null);
      setNewContent('');
    } catch (error) {
      console.error('Error editing comment:', error);
      setError('Failed to edit comment');
    }
  };

  const startEditing = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setNewContent(currentContent);
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
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className={styles.editInput}
                  />
                  <button onClick={() => handleEdit(comment.id)} className={styles.saveButton}>
                    Save
                  </button>
                  <button onClick={() => setEditingCommentId(null)} className={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              ) : (
                <p>{comment.content}</p>
              )}
              <p><small>{new Date(comment.created_at).toLocaleString()}</small></p>
              {currentUserId === comment.author_id && (
                <div>
                  <button
                    onClick={() => startEditing(comment.id, comment.content)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
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
