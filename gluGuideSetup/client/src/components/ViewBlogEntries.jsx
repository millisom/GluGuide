import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewBlogEntries = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate for programmatic routing


  // Fetch posts when the component loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getUserPost', {
          withCredentials: true
        });
        setPosts(response.data || []);
      } catch (error) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', error.response ? error.response.data : error.message);
      }
    };
    fetchPosts();
  }, []);

  // Handler for viewing a post
  const handleViewClick = (postId) => {
    navigate(`/blogs/view/${postId}`); // Navigate to the view page for the selected post
  };

  // Handler for editing a post
  const handleEditClick = (postId) => {
    navigate(`/blogs/edit/${postId}`); // Navigate to the edit page for the selected post
  };


  return (
    <div>
      <h2>Your Blog Entries</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <div key={post.id} style={{ marginBottom: '1rem' }}>
              <h4 
                onClick={() => handleViewClick(post.id)} 
                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
              >
                {post.title}
              </h4>
              <p>Created at: {new Date(post.created_at).toLocaleDateString('en-US')}</p>
           {/*   <button onClick={() => handleEditClick(post.id)}>Edit</button>  Edit button */}
            </div>
          ))}
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ViewBlogEntries;