import { useState, useEffect } from "react";
import axiosInstance from '../api/axiosConfig';
import CreateComment from "./createComment";
import CommentsList from "./fetchComments";
import PropTypes from 'prop-types';

const CommentsSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/status", { withCredentials: true })
      .then((res) => setIsAdmin(res.data.is_admin))
      .catch(() => setIsAdmin(false));
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(
        `/comments/${postId}`,
        {
          withCredentials: true,
        }
      );
      setComments(response.data.comments || []);
      setCurrentUserId(response.data.currentUserId);
      setError("");
    } catch (error) {
      console.error("Error loading comments:", error);
      setError("Failed to load comments");
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentCreated = () => {
    fetchComments();
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <CreateComment 
        postId={postId} 
        onCommentCreated={handleCommentCreated} 
        hasExistingComments={comments && comments.length > 0}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <CommentsList
        comments={comments}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
        refreshComments={fetchComments}
      />
    </div>
  );
};

CommentsSection.propTypes = {
  postId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
};

export default CommentsSection;
