// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const CommentsList = () => {
//   const { id: post_id } = useParams()
//   const [comments, setComments] = useState([]);
//   const [error, setError] = useState('');

//   // Fetch existing comments when the component mounts
//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/comments/${post_id}`, {
//           withCredentials: true,
//         });
//         setComments(response.data); 
//       } catch (error) {
//         console.error('Error loading comments:', error);
//         setError('Failed to load comments');
//       }
//     };

//     fetchComments();
//   }, [post_id]);

//   return (
//     <div>
//       <h3>Comments</h3>
//       {error && <p className="error">{error}</p>}

//       {/* Display existing comments */}
//       <div className="comments-list">
//         {comments.length > 0 ? (
//           comments.map((comment) => (
//             <div key={comment.id} className="comment">
//               <p><strong>Author :</strong> {comment.username}</p>
//               <p>{comment.content}</p>
//               <p><small>{new Date(comment.created_at).toLocaleString()}</small></p>
//             </div>
//           ))
//         ) : (
//           <p>No comments yet. Be the first to comment!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommentsList;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Comments.module.css';

const CommentsList = () => {
  const { id: post_id } = useParams();
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');


  // Fetch existing comments when the component mounts
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/comments/${post_id}`, {
        withCredentials: true,
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Failed to load comments');
    }
  };


  useEffect(() => {
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
              <button onClick={() => handleLike(comment.id)}>Like ({comment.likes})</button>
              <span> / </span>
              <button onClick={() => handleDislike(comment.id)}>Dislike ({comment.dislikes})</button>
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
