import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        <button type="submit">Create Post</button>
        {error && <p>{error}</p>} {/* Display error message */}
        {successMessage && <p>{successMessage}</p>} {/* Display success message */}
      </form>
    </div>
  );
};

export default CreatePost;
