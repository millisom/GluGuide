import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CommentsList = () => {
  const { id: post_id } = useParams()
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  // Fetch existing comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/comments/${post_id}`, {
          withCredentials: true,
        });
        setComments(response.data); // Set comments in state
      } catch (error) {
        console.error('Error loading comments:', error);
        setError('Failed to load comments');
      }
    };

    fetchComments();
  }, [post_id]);

  return (
    <div>
      <h3>Comments</h3>
      {error && <p className="error">{error}</p>}

      {/* Display existing comments */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p><strong>Author:</strong> {comment.author_id}</p>
              <p>{comment.content}</p>
              <p><small>{new Date(comment.created_at).toLocaleString()}</small></p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsList;
