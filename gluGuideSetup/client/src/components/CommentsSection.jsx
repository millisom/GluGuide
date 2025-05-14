import React, { useState, useEffect } from "react";
import axiosInstance from '../api/axiosConfig';
import CreateComment from "./createComment";
import CommentsList from "./fetchComments";

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
      setComments(response.data.comments);
      setCurrentUserId(response.data.currentUserId);
    } catch (error) {
      console.error("Error loading comments:", error);
      setError("Failed to load comments");
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
      <CreateComment postId={postId} onCommentCreated={handleCommentCreated} />

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

export default CommentsSection;
