import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import ReactQuill from 'react-quill'; // Import Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/CreateBlogPost.module.css';

const API_BASE_URL = import.meta.env.VITE_API_URL; // For status check

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postPicture, setPostPicture] = useState(null);
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state
  const [authLoading, setAuthLoading] = useState(true); // New state

  useEffect(() => {
    const fetchSessionStatus = async () => {
      setAuthLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/status`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            setIsLoggedIn(data.valid);
        } else {
            console.error("CreatePost: Auth status check failed with status:", response.status);
            setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("CreatePost: Error fetching session status:", err);
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchSessionStatus();
  }, []);

  const handleFileChange = (e) => {
    setPostPicture(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const plainTextContent = content.replace(/<[^>]+>/g, '').trim();
    if (!title.trim() || !plainTextContent) {
        setError('Title and content cannot be empty.');
        setSuccessMessage('');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tagsInput);
    if (postPicture) formData.append('post_picture', postPicture);

    setError('');
    setSuccessMessage('');

    try {
      const response = await axiosInstance.post('/createPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data?.post?.id) {
        const { id } = response.data.post;
        setTitle('');
        setContent('');
        setPostPicture(null);
        setTagsInput('');
        setSuccessMessage('Post created successfully! Redirecting...');
        setTimeout(() => navigate(`/blogs/view/${id}`), 1500);
      } else {
        console.error('Post ID not found in response:', response.data);
        setError('Post created, but could not redirect. Please check the Blogs page.');
        setTitle('');
        setContent('');
        setPostPicture(null);
        setTagsInput('');
      }

    } catch (errCatch) {
      if (errCatch.response && errCatch.response.status === 401) {
        setError('You must be logged in to create a post.');
      } else {
        console.error('Error creating post:', errCatch.response ? errCatch.response.data : errCatch.message);
        setError('Failed to create post. Please check your input and try again.');
      }
    }
  };

  if (authLoading) {
    return <div className={styles.createPostContainer}><p className={styles.loadingMessage || 'formLoading'}>Loading form...</p></div>;
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.createPostContainer}> 
        <div className={styles.authPromptContainer}> 
          <p className={styles.authPromptMessage}>
            Want to share your insights? Please <Link to="/login" className={styles.authLink}>Login</Link> or {' '}
            <Link to="/signUp" className={styles.authLink}>Create an Account</Link> to publish your blog posts.
          </p>
        </div>
      </div>
    );
  }

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
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, false] }],
                  ['bold', 'italic', 'underline','strike', 'blockquote'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
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
            <label className={styles.label}>Upload Picture (Optional):</label>
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

