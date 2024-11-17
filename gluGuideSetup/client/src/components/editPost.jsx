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
  const [image, setImage] = useState(null);
const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserPost/${id}`, {
          withCredentials: true,
        });
        setTitle(response.data.title);
        setContent(response.data.content);
        setImageUrl(response.data.image_url || '');
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

  const handleUploadImage = async () => {
    const formData = new FormData();
    formData.append('postImage', image);
  
    try {
      const response = await axios.post(`http://localhost:8080/uploadPostImage/${id}`, formData, {
        withCredentials: true,
      });
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const handleDeleteImage = async () => {
    try {
      await axios.delete(`http://localhost:8080/deletePostImage/${id}`, {
        withCredentials: true,
      });
      setImageUrl('');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  


  return (
    <div className={styles.editPostContainer}>
      <h2 className={styles.title}>Edit Post</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.form}>
        {/* Post Title */}
        <label className={styles.label}>Post Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className={styles.input}
        />
  
        {/* Post Content */}
        <label className={styles.label}>Content:</label>
        <ReactQuill
          value={content}
          onChange={setContent}
          className={styles.quillEditor}
        />
  
        {/* Image Upload Section */}
        <label className={styles.label}>Post Image:</label>
        {imageUrl && (
          <div className={styles.imagePreview}>
            <img src={imageUrl} alt="Post Preview" className={styles.previewImage} />
            <button
              onClick={handleDeleteImage}
              className={styles.deleteImageButton}
            >
              Delete Image
            </button>
          </div>
        )}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className={styles.fileInput}
        />
        <button onClick={handleUploadImage} className={styles.uploadButton}>
          Upload Image
        </button>
  
        {/* Action Buttons */}
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
