import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        // Make the POST request
        const response = await axios.post('http://localhost:8080/posts', { title, content, username, });
        console.log('Post created:', response.data); // Log the response for debugging
        // Reset fields or handle success here
      } catch (error) {
       // console.error('Error:', error); // Log the error for debugging
        setError('Failed to create post'); // Set error message to display
      }
    };

  return (
    <div>
      <h2>Create new Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          />
        </div>
        <button type="submit">Create Post</button>
        {error && <p>{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
};

export default CreatePost;
