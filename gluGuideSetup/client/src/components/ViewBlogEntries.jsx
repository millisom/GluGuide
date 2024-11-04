import React, { useState, useEffect } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';

const UserBlogEntries = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // Fetch posts from the server when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getUserPost', {
          withCredentials: true}); // Fetch from backend with cookies
        setPosts(response.data || []); // Set posts to the response data
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
    {posts.length === 0 ? (
          <p>No posts found.</p>
    ) : (
      <div>
      {posts.map((post) => (
        <div key={post.id}>
          <div>
            <h4>Title: {post.title}</h4>
            <p>Created at: {new Date(post.created_at).toLocaleDateString('en-US')}</p>
          </div>
        </div>
      ))}
    </div>
  )}
  </div>
);
};

export default UserBlogEntries;