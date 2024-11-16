import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../styles/EditPost.module.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserPost/${id}`, {
          withCredentials: true,
        });
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        setError('Failed to load post');
        console.error('Error loading post:', error.response ? error.response.data : error.message);
      }
    };
    fetchPost();
  }, [id]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/updatePost/${id}`,
        { title, content },
        { withCredentials: true }
      );
      navigate(`/viewPost/${id}`); // Redirect back to the view page after saving
    } catch (error) {
      setError('Failed to save changes');
      console.error('Error saving post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.editPostContainer}>
      <h2 className={styles.title}>Edit Post</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.form}>
        <label className={styles.label}>Post Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className={styles.input}
        />
        <label className={styles.label}>Content:</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          className={styles.quillEditor}
        />
        <div className={styles.buttonGroup}>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={styles.saveButton}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => navigate(`/viewPost/${id}`)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
