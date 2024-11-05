import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';

const ViewPost = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

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

  return (
    <div>
      {post ? (
        <div>
          <h2>{post.title}</h2>
          <div  className='content-box'>
          {parse(post.content)}</div>
          <button onClick={() => navigate(`/blogs/edit/${id}`)}>Edit</button> {/* Navigate to edit page */}
          <button onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
            Delete Post
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ViewPost;