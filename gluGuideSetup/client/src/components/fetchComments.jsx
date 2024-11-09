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

  useEffect(() => {
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

    fetchComments();
  }, [post_id]);

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
