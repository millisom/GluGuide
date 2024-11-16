import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Comments.module.css';

const CommentsList = () => {
  const { id: post_id } = useParams();
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
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

  const handleLike = async (commentId) => {
    try {
      const response = await axios.post(`http://localhost:8080/comments/${commentId}/like`, {}, { withCredentials: true });
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, likes: response.data.likes, dislikes: response.data.dislikes } : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      const response = await axios.post(`http://localhost:8080/comments/${commentId}/dislike`, {}, { withCredentials: true });
      setComments(comments.map(comment =>
        comment.id === commentId ? { ...comment, likes: response.data.likes, dislikes: response.data.dislikes } : comment
      ));
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

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
      <h3 className={styles.title}>Comments ({comments.length})</h3>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.commentsList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentCard}>
              <p className={styles.commentAuthor}>
                <strong>{comment.username}</strong> said:
              </p>
              {editingCommentId === comment.id ? (
                <div className={styles.editContainer}>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className={styles.editInput}
                  />
                  <div className={styles.editButtonGroup}>
                    <button
                      onClick={() => handleEdit(comment.id)}
                      className={styles.saveButton}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className={styles.commentContent}>{comment.content}</p>
              )}
              <p className={styles.commentDate}>
                {new Date(comment.created_at).toLocaleString()}
              </p>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => handleLike(comment.id)}
                  className={styles.likeButton}
                >
                  👍 Like ({comment.likes})
                </button>
                <button
                  onClick={() => handleDislike(comment.id)}
                  className={styles.dislikeButton}
                >
                  👎 Dislike ({comment.dislikes})
                </button>
                {currentUserId === comment.author_id && (
                  <>
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
                  </>
                )}
              </div>
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
