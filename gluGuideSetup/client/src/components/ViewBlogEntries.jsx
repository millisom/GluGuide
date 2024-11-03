import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserBlogEntries = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // Fetch posts from the server when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/posts'); // Fetch from backend
        setPosts(response.data); // Set posts to the response data
      } catch (error) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', error.response ? error.response.data : error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
    <h2>Your Blog Entries</h2>
    {error && <p>{error}</p>}
    {posts.length === 0 ? (
      <p>No posts found.</p>
    ) : (
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p><em>Created at: {new Date(post.created_at).toLocaleString()}</em></p>
          </li>
        ))}
      </ul>
    )}
  </div>
);
};

export default UserBlogEntries;