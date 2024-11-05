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

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserPost/${id}`, {
          withCredentials: true
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
    console.log('Title to be saved:', title);
    try {
   
      await axios.put(`http://localhost:8080/updatePost/${id}`, {
        title,
        content
      }, {
        withCredentials: true
      });
      navigate(`/blogs`); // Redirect back to view page after saving
    } catch (error) {
      setError('Failed to save changes');
      console.error('Error saving post:', error);
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
      <button onClick={handleSave}>Save</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default EditPost;