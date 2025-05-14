import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../styles/EditPost.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark, faSave } from '@fortawesome/free-solid-svg-icons';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get(`/getPost/${id}`, {
          withCredentials: true,
        });
        setTitle(response.data.title);
        setContent(response.data.content);
        setTagsInput(Array.isArray(response.data.tags) ? response.data.tags.join(', ') : '');
        setImageUrl(
          response.data.post_picture
            ? `/uploads/${response.data.post_picture}`
            : ""
        );
      } catch (error) {
        setError('Failed to load post data. Please try again.');
        console.error('Error loading post:', error.response ? error.response.data : error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    try {
      const payload = { title, content, tags: tagsInput };
      await axiosInstance.put(
        `/updatePost/${id}`,
        payload,
        { withCredentials: true }
      );
      navigate(`/viewPost/${id}`);
    } catch (error) {
      setError('Failed to save changes. Please check your input.');
      console.error('Error saving post:', error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append('postImage', image);
  
    try {
      const response = await axiosInstance.post(`/uploadPostImage/${id}`, formData, {
        withCredentials: true,
      });
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError("Failed to upload image.");
    }
  };

  const handleDeleteImage = async () => {
    try {
      await axiosInstance.delete(`/deletePostImage/${id}`, {
        withCredentials: true,
      });
      setImageUrl('');
    } catch (error) {
      console.error('Error deleting image:', error);
      setError("Failed to delete image.");
    }
  };

  return (
    <div className={styles.editPostContainer}>
      <h2 className={styles.title}>Edit Your Post</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {isLoading && <p>Loading post data...</p>}

      {!isLoading && (
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
  
          {/* Tags Input */}
          <label className={styles.label}>Tags (comma-separated):</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g., health, diet, tips"
            className={styles.input}
          />
  
          {/* Image Upload Section */}
          <label className={styles.label}>Current Post Image:</label>
          {imageUrl ? (
            <>
              <div className={styles.imagePreview}>
                <img
                  src={imageUrl}
                  alt="Post Preview"
                  className={styles.previewImage}
                />
              </div>
              <div className={styles.inputField}>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={handleDeleteImage}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className={styles.iconSpacing}
                  />
                  Remove Image
                </button>
              </div>
            </>
          ) : (
            <>
              <p>There is no current image set.</p>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={handleDeleteImage}
                disabled
              >
                <FontAwesomeIcon icon={faTrash} className={styles.iconSpacing} />
                Remove Image
              </button>
            </>
          )}

          <label className={styles.label}>Upload New Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className={styles.fileInput}
          />
          <small>First choose a new image, then click "Upload Image"!</small>
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
              <FontAwesomeIcon icon={faSave} className={styles.iconSpacing} />
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => navigate(`/viewPost/${id}`)}
              className={styles.cancelButton}
            >
              <FontAwesomeIcon icon={faXmark} className={styles.iconSpacing} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPost;
