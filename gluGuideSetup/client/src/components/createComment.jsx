import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CreateComment = () => {
  const { id: post_id } = useParams()
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:8080/comments',
        { post_id, content },
        { withCredentials: true } // Ensure session credentials are sent
      );

      console.log('Comment created:', response.data);
      setContent(''); // Clear the input field after submission
      setSuccessMessage('Comment added successfully!');
    } catch (error) {
      console.error('Error creating comment:', error.response ? error.response.data : error.message);
      setError('Failed to add comment');
    }
  };

  return (
    <div>
      <h3>Add a Comment</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Comment:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Comment</button>
        {error && <p>{error}</p>}
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
};

export default CreateComment;

