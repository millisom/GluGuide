import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';
import styles from '../styles/Comments.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const CommentsList = ({ comments, currentUserId, isAdmin, refreshComments }) => {
  const navigate = useNavigate();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const fetchSessionStatus = async () => {
      setAuthLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/status`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            setIsLoggedIn(data.valid);
        } else {
            console.error("Auth status check failed with status:", response.status);
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

  const handleAuthorClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleLike = async (commentId) => {
    try {
      await axiosInstance.post(
        `/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );
      refreshComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await axiosInstance.post(
        `/comments/${commentId}/dislike`,
        {},
        { withCredentials: true }
      );
      refreshComments();
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    const url = isAdmin
      ? `/admin/comments/${commentId}`
      : `/comments/${commentId}`;

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axiosInstance.delete(url, { withCredentials: true });
        refreshComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleEdit = async (commentId) => {
    const url = isAdmin
      ? `/admin/comments/${commentId}`
      : `/comments/${commentId}`;

    try {
      await axiosInstance.put(url, { content: newContent }, { withCredentials: true });
      setEditingCommentId(null);
      setNewContent("");
      refreshComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const startEditing = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setNewContent(currentContent);
  };

  if (authLoading) {
    return <p className={styles.loadingMessage}>Loading comments...</p>;
  }

  if (!comments || comments.length === 0) {
    if (isLoggedIn) {
        return (
          <p className={styles.noComments}>
            No comments yet. Be the first to comment!
          </p>
        );
    }
    return null;
  }

  return (
    <div className={styles.commentsContainer}>
      <h3 className={styles.title}>Comments ({comments.length})</h3>
      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentCard}>
            <p className={styles.commentAuthor}>
              <button 
                className={styles.authorButton}
                onClick={() => handleAuthorClick(comment.username)}
              >
                {comment.username}
              </button>{" "}
              said:
            </p>

            {editingCommentId === comment.id ? (
              <div className={styles.editContainer}>
                <ReactQuill
                  value={newContent}
                  onChange={setNewContent}
                  theme="snow"
                  className={styles.editInput}
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
              <div className={styles.commentContent}>{comment.content && parse(comment.content)}</div>
            )}

            <p className={styles.commentDate}>
              Commented at: {new Date(comment.created_at).toLocaleString()}
              {new Date(comment.created_at).getTime() !== new Date(comment.updated_at).getTime() && (
                <>
                  {" "}
                  | Last updated at: {new Date(comment.updated_at).toLocaleString()}
                </>
              )}
            </p>

            <div className={styles.commentFooter}>
              <div className={styles.buttonGroup}>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={styles.likeButton}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} /> Like ({comment.likes})
                    </button>
                    <button
                      onClick={() => handleDislike(comment.id)}
                      className={styles.dislikeButton}
                    >
                      <FontAwesomeIcon icon={faThumbsDown} /> Dislike ({comment.dislikes})
                    </button>
                  </>
                ) : (
                  <p className={styles.authActionPrompt}>
                    <Link to="/login" className={styles.authLink}>Login</Link> or <Link to="/signUp" className={styles.authLink}>Sign Up</Link> to rate.
                  </p>
                )}
                {(currentUserId === comment.author_id || isAdmin) && (
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
              <small className={styles.commentId}>Comment ID: (#{comment.id})</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    username: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    likes: PropTypes.number,
    dislikes: PropTypes.number,
    author_id: PropTypes.any.isRequired,
  })).isRequired,
  currentUserId: PropTypes.any,
  isAdmin: PropTypes.bool,
  refreshComments: PropTypes.func.isRequired,
};

CommentsList.defaultProps = {
  currentUserId: null,
  isAdmin: false,
};

export default CommentsList;