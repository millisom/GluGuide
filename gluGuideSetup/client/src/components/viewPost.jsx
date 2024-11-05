import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';

const ViewPost = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserPost/${id}`, {
          withCredentials: true
        });
        setPost(response.data || []);
      } catch (error) {
        setError('Failed to load post');
        console.error('Error loading post:', error.response ? error.response.data : error.message);
      }
    };
    fetchPost();
  }, [id]
);

const handleDelete = async () => {
  if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
    try {
      await axios.delete(`http://localhost:8080/deletePost/${id}`, {
        withCredentials: true
      });
      alert('Post deleted successfully.');
      navigate(`/blogs`); // Redirect back to the list of posts after deletion
    } catch (error) {
      setError('Failed to delete post');
      console.error('Error deleting post:', error);
    }
  }
};

useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await axios.get(`/comments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  fetchComments();
}, [postId]);

const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!commentContent.trim()) {
    alert("Comment can't be empty!");
    return;
  }

  try {
    const response = await axios.post('/comments', {
      postId,
      content: commentContent,
    });
    setComments([response.data.comment, ...comments]); // Add new comment to the list
    setCommentContent(''); // Clear the comment input
  } catch (error) {
    console.error('Error creating comment:', error);
    alert('Could not post comment.');
  }
};


return (
  <div>
    {post ? (
      <div>
        <h2>{post.title}</h2>
        <div className='content-box'>
          {parse(post.content)}
        </div>
        <button onClick={() => navigate(`/blogs/edit/${postId}`)}>Edit</button>
        <button onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
          Delete Post
        </button>
      </div>
    ) : (
      <p>Loading...</p>
    )}
    {error && <p>{error}</p>}

    {/* Comments Section */}
    <h3>Comments</h3>
    <form onSubmit={handleCommentSubmit}>
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
        rows="3"
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button type="submit">Post Comment</button>
    </form>

    <div style={{ marginTop: '20px' }}>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <p>{comment.content}</p>
            <small>Posted at: {new Date(comment.created_at).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  </div>
);
};
export default ViewPost;