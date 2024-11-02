import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logout from './logout';
import './profileCard.css';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [dpUrl, setDpUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingDp, setIsEditingDp] = useState(false);
  const [isEditingPosts, setIsEditingPosts] = useState(false);
  const [selectedDpFile, setSelectedDpFile] = useState(null);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8080/status');
        if (res.data.valid) {
          setUser(res.data.username);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchBio = async () => {
      try {
        const res = await axios.get('http://localhost:8080/bio');
        setBio(res.data.profile_bio);
      } catch (err) {
        console.error('Error fetching bio:', err);
        setError('Failed to fetch bio.');
      }
    };

    const fetchDp = async () => {
      try {
        const res = await axios.get('http://localhost:8080/dp');
        setDpUrl(res.data.url || 'https://via.placeholder.com/150');
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setDpUrl('https://via.placeholder.com/150');
        } else {
          console.error('Error fetching dp:', err);
          setError('Failed to fetch dp.');
        }
      }
    };

    fetchBio();
    fetchDp();
    fetchUser();
  }, [navigate]);

  const handleSaveBio = async () => {
    try {
      const response = await axios.post('http://localhost:8080/setBio', { profile_bio: bio });
      
      if (response.status === 200) {
        setIsEditingBio(false);
      } else {
        console.error('Failed to update bio:', response.data.error);
        setError('Failed to update bio.');
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      setError('Failed to update bio.');
    }
  };
  

  const handleSaveDp = async () => {
    if (!selectedDpFile) {
      alert("Please select a file before saving.");
      return;
    }
    
    const formData = new FormData();
    formData.append('dp', selectedDpFile);

    try {
      const response = await axios.post('http://localhost:8080/setDp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setDpUrl(response.data.url);
      setIsEditingDp(false);
    } catch (error) {
      console.error('Error updating DP:', error);
      setError('Failed to update DP.');
    }
  };

  const handleFileChange = (event) => {
    setSelectedDpFile(event.target.files[0]);
  };

  const handleDeleteDp = async () => {
    try {
      const response = await axios.delete('http://localhost:8080/deleteDp');
      if (response.status === 200) {
        setDpUrl('');
      } else {
        console.error('Failed to delete DP:', response.data.error);
        setError('Failed to delete DP.');
      }
    } catch (error) {
      console.error('Error deleting DP:', error);
      setError('Error deleting DP.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="profile-card">
      <div className="header">
        {isEditingDp ? (
          <>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSaveDp}>Save</button>
          </>
        ) : (
          <>
            <img
              src={dpUrl || ''}
              alt="User Profile Picture"
              onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
            />
              <button onClick={handleDeleteDp}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={setIsEditingDp}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </>
        )}
      </div>

      <div className="section">
        <h3>Username</h3>
        <p>{user}</p>
      </div>

      <div className="section">
        <h3>Bio</h3>
        {isEditingBio ? (
          <>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Edit your bio"
            />
            <button onClick={handleSaveBio}>Save</button>
          </>
        ) : (
          <>
            <p>{bio}</p>
            <button onClick={setIsEditingBio}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </>
        )}
      </div>

      <div className="section">
        <h3>Posts</h3>
        {isEditingPosts ? (
          <>
            <textarea
              placeholder="Edit posts (no backend logic)"
              onChange={(e) => {
              }}
            />
            <button onClick={() => setIsEditingPosts(false)}>Save</button>
          </>
        ) : (
          <>
            <p>No posts yet</p>
            <button onClick={() => setIsEditingPosts(true)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </>
        )}
      </div>

      <div className="actions">
        <button className="delete-btn">Delete Account</button>
      </div>

      <div className="section">
        <Logout />
      </div>
    </div>
  );
};

export default ProfileCard;
