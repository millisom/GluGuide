import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postPicture, setPostPicture] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleFileChange = (e) => {
    setPostPicture(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (postPicture) formData.append('postPicture', postPicture);
    try {
        // Make the POST request
        const response = await axios.post('http://localhost:8080/CreatePost', formData, {withCredentials: true});
        headers: { 'Content-Type': 'multipart/form-data' },
        console.log('Post created:', response.data); // Log the response for debugging
        // Reset fields or handle success here
        setTitle('');
        setContent('');
        setPostPicture(null);
        setSuccessMessage('Post created successfully!');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('You must be logged in to create a post.'); // Custom message for 401
      } else {
          console.error('Error:', error.response ? error.response.data : error.message);
          setError('Failed to create post'); // General error message
      }
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
          {/* Use ReactQuill instead of textarea */}
          <ReactQuill
            value={content}
            onChange={setContent} // Update content state
            required
          />
        </div>
        <div>
          <label>Upload Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit">Create Post</button>
        {error && <p>{error}</p>} {/* Display error message */}
        {successMessage && <p>{successMessage}</p>} {/* Display success message */}
      </form>
    </div>
  );
};

export default CreatePost;
