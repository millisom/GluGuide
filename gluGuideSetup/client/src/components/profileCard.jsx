import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import styles from '../styles/ProfileCard.module.css';
import ReactQuill from 'react-quill';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [dpUrl, setDpUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingDp, setIsEditingDp] = useState(false);
  const [selectedDpFile, setSelectedDpFile] = useState(null);
  const navigate = useNavigate();

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

  const handleDeleteAccount = async () => {
    const confirmDelete = prompt('Are you sure you want to delete your account?');
    if (!confirmDelete) return;
    try {
      const response = await axios.post('http://localhost:8080/deleteAccount', { confirmDelete });

      if (response.status === 200) {
        alert('Account deleted successfully.');
        navigate('/login');
      } else {
        console.error('Failed to delete account:', response.data.error);
        setError('Failed to delete account.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Error deleting account.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <section className={styles.cardBio}>
        <div className={styles.cardBodyBio}>
          <div>
            {isEditingDp ? (
              <>
                <input type='file' onChange={handleFileChange} />
                <button className={styles.squareButton} onClick={handleSaveDp}>
                  Save
                </button>
                <button
                  className={styles.squareButton}
                  onClick={() => setIsEditingDp(false)}
                >
                  Cancel
                </button>
                <button
                  className={styles.squareButton}
                  onClick={handleDeleteDp}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <div className={styles.bioContainer}>
                  <div className={styles.dpContainer}>
                    <img
                      className={styles.bioImg}
                      src={dpUrl || ''}
                      alt='User Profile Picture'
                    />
                    <button
                      className={styles.icon2}
                      onClick={() => setIsEditingDp(true)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  </div>
                  <p className={styles.username}>{user}</p>
                </div>
              </>
            )}
          </div>
          <div className={styles.bioContainer2}>
            <div className={styles.bio}>
              {isEditingBio ? (
                <>
                  <ReactQuill
                    theme='snow'
                    value={bio}
                    onChange={(value) => setBio(value)}
                  />
                  <button
                    className={styles.squareButton}
                    onClick={handleSaveBio}
                  >
                    Save
                  </button>
                  <button
                    className={styles.squareButton}
                    onClick={() => setIsEditingBio(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div>{parse(bio)}</div>{' '}
                  {/* Correct usage to render HTML content */}
                  <button
                    className={styles.icon}
                    onClick={() => setIsEditingBio(true)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </>
              )}
            </div>
            <button
              className={styles.icon}
              onClick={() => setIsEditingBio(true)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.squareButton}
              onClick={() => navigate('/myBlogs')}
            >
              My Blogs
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.squareButton}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileCard;
