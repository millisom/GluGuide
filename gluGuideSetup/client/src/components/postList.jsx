import React, { useEffect, useState } from 'react';
import axios from 'axios';

const postList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('http://localhost:5000/posts');
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.map(post => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>By {post.author} on {new Date(post.date).toDateString()}</small>
        </div>
      ))}
    </div>
  );
};

export default postList;
