import { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CreateBlogPost.module.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postPicture, setPostPicture] = useState(null);
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPostPicture(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tagsInput);
    if (postPicture) formData.append('post_picture', postPicture);

    // Clear previous errors/success messages
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8080/createPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log('Post created:', response.data); // Log the response for debugging

      if (response.data?.post?.id) {
        const { id } = response.data.post;
        setTitle('');
        setContent('');
        setPostPicture(null);
        setTagsInput('');
        setSuccessMessage('Post created successfully!');
        setTimeout(() => navigate(`/viewPost/${id}`), 1500);
      } else {
        console.error('Post ID not found in response:', response.data);
        setError('Post created, but could not redirect. Please check the Blogs page.');
        setTitle('');
        setContent('');
        setPostPicture(null);
        setTagsInput('');
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('You must be logged in to create a post.'); // Custom message for 401
      } else {
        console.error('Error:', error.response ? error.response.data : error.message);
        setError('Failed to create post. Please check your input and try again.'); // General error message
      }
    }
  };

  return (
    <div className={styles.createPostContainer}>
      <div className={styles.createPostRectangle}>
        <h2 className={styles.formTitle}>Create New Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Content:</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              className={styles.quillEditor}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tags (comma-separated):</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={styles.input}
              placeholder="e.g., pregnancy, diet, tips"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Upload Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Create Post
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

