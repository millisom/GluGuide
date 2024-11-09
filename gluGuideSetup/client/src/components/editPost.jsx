import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);  // State for the existing image

  // Fetch the post details on load
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserPosts/${id}`, {
          withCredentials: true
        });
        setTitle(response.data.title);
        setContent(response.data.content);
        setImage(response.data.image);  // Assuming `image` URL or data is in the response
      } catch (error) {
        setError('Failed to load post');
        console.error('Error loading post:', error.response ? error.response.data : error.message);
      }
    };
    fetchPost();
  }, [id]);

  // Save the post with optional image
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    
    if (image instanceof File) {
      formData.append('post_picture', image);
    }

    try {
      await axios.put(`http://localhost:8080/updatePost/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      navigate(`/viewPost/${id}`); // Redirect back to view page after saving
    } catch (error) {
      setError('Failed to save changes');
      console.error('Error saving post:', error);
    }
  };

  // Handle image deletion
  const handleImageDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/deleteImage/${id}`, {
        withCredentials: true
      });
      if (response.status === 200){
        setImage(null);
      } else {
        console.error('Failed to delete Post Picture:', response.data.error);
        setError('Failed to delete Post Picture.');
      }

    } catch (error) {
      setError('Failed to delete image');
      console.error('Error deleting image:', error);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Set the file as the new image
  
      const formData = new FormData();
      formData.append('post_picture', file);
  
      try {
        const response = await axios.put(`http://localhost:8080/uploadImage/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        
        // Assuming response contains the URL to the uploaded image
        setImage(response.data.url); // Update with the new image URL from the response
      } catch (error) {
        setError('Failed to upload new image');
        console.error('Error uploading image:', error.response || error.message);
      }
    }
  };


  return (
    <div>
      <h2>Edit Post</h2>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Post title"
      />
      <ReactQuill value={content} onChange={setContent} />

      {/* Image display and upload */}
      {image ? (
      <div>
        <img src={image || ''} alt="Post" style={{ maxWidth: '200px', marginTop: '10px' }} />
          <button onClick={handleImageDelete}>Delete Image</button>
        </div>
  ) : (
    <div>
     <input type="file" onChange={handleImageChange} />
    </div>
  )}

      <button onClick={handleSave}>Save</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default EditPost;
