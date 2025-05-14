import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';
import styles from '../styles/Comments.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const CommentsList = ({ comments, currentUserId, isAdmin, refreshComments }) => {
  const navigate = useNavigate();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newContent, setNewContent] = useState("");

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

  if (!comments || comments.length === 0) {
    return (
      <p className={styles.noComments}>
        No comments yet. Be the first to comment!
      </p>
    );
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
              // Use html-react-parser to render the stored Quill HTML
              <div className={styles.commentContent}>{parse(comment.content)}</div>
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
                <button
                  onClick={() => handleLike(comment.id)}
                  className={styles.likeButton}
                >
                  <FontAwesomeIcon icon={faThumbsUp} className={styles.heart} /> Like (
                  {comment.likes})
                </button>
                <button
                  onClick={() => handleDislike(comment.id)}
                  className={styles.dislikeButton}
                >
                  <FontAwesomeIcon icon={faThumbsDown} className={styles.heart} /> Dislike (
                  {comment.dislikes})
                </button>
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

export default CommentsList;