import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import CreateComment from "./createComment";

const ViewPost = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserPost/${id}`, {
          withCredentials: true,
        });
        setPost(response.data || {});
      } catch (error) {
        setError('Failed to load post');
        console.error('Error loading post:', error.response ? error.response.data : error.message);
      }
    };
    fetchPost();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {post ? (
        <div>
          <h2>{post.title}</h2>
          <p>Author: {post.username}</p>
          <p>Created on: {new Date(post.created_at).toLocaleDateString()}</p>
          {post.updated_at && (
            <p><strong>Last Edited:</strong> {new Date(post.updated_at).toLocaleString()}</p>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginTop: '20px' }}>
            {post.post_picture && (
              <img
                src={`http://localhost:8080/uploads/${post.post_picture}`}
                alt="Blog post"
                style={{ width: '50%', height: 'auto', objectFit: 'cover' }}
              />
            )}
            <div className="content-box" style={{ width: '100%' }}>
              {parse(post.content)}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {error && <p>{error}</p>}
      <CreateComment/>
    </div>
    
  );
};

export default ViewPost;