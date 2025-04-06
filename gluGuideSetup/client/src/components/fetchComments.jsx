import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Comments.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const CommentsList = ({
  comments,
  currentUserId,
  isAdmin,
  refreshComments,
}) => {
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [newContent, setNewContent] = useState("");

  const handleLike = async (commentId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/comments/${commentId}/like`,
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
      const response = await axios.post(
        `http://localhost:8080/comments/${commentId}/dislike`,
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
      ? `http://localhost:8080/admin/comments/${commentId}`
      : `http://localhost:8080/comments/${commentId}`;

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(url, { withCredentials: true });
        refreshComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleEdit = async (commentId) => {
    const url = isAdmin
      ? `http://localhost:8080/admin/comments/${commentId}`
      : `http://localhost:8080/comments/${commentId}`;

    try {
      await axios.put(url, { content: newContent }, { withCredentials: true });
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
              Commented at: {new Date(comment.created_at).toLocaleString()}
              {new Date(comment.created_at).getTime() !==
                new Date(comment.updated_at).getTime() && (
                <>
                  {" "}
                  | Last updated at:{" "}
                  {new Date(comment.updated_at).toLocaleString()}
                </>
              )}
            </p>

            <div className={styles.commentFooter}>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => handleLike(comment.id)}
                  className={styles.likeButton}
                >
                  <FontAwesomeIcon icon={faThumbsUp} className={styles.heart} />{" "}
                  Like ({comment.likes})
                </button>
                <button
                  onClick={() => handleDislike(comment.id)}
                  className={styles.dislikeButton}
                >
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    className={styles.heart}
                  />{" "}
                  Dislike ({comment.dislikes})
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
              <small className={styles.commentId}>
                Comment ID: (#{comment.id})
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
