import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faSave, faTimes, faSignOutAlt, faBlog, faUtensils, faBookOpen, faPlusCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/ProfileCard.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [currentBio, setCurrentBio] = useState('');
  const [dpUrl, setDpUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingDp, setIsEditingDp] = useState(false);
  const [selectedDpFile, setSelectedDpFile] = useState(null);
  const [previewDp, setPreviewDp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [statusRes, bioRes, dpRes] = await Promise.all([
          axiosInstance.get('/status'),
          axiosInstance.get('/bio'),
          axiosInstance.get('/dp').catch(err => {
            if (err.response && err.response.status === 404) {
              return { data: { url: '' } };
            }
            throw err;
          })
        ]);

        if (statusRes.data.valid) {
          setUser(statusRes.data.username);
        } else {
          navigate('/login');
          return;
        }

        setBio(bioRes.data.profile_bio || '');
        setCurrentBio(bioRes.data.profile_bio || '');
        setDpUrl(dpRes.data.url || '');

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to fetch profile data. Please try refreshing.');
        setUser('User');
        setBio('Could not load bio.');
        setCurrentBio('Could not load bio.');
        setDpUrl('');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleBioEditToggle = () => {
    setCurrentBio(bio);
    setIsEditingBio(!isEditingBio);
  };

  const handleSaveBio = async () => {
    try {
      const response = await axiosInstance.post('/setBio', { profile_bio: currentBio });
      if (response.status === 200) {
        setBio(currentBio);
        setIsEditingBio(false);
        setError(null);
      } else {
        setError('Failed to update bio. Server returned an error.');
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      setError(`Failed to update bio: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedDpFile(file);
      setPreviewDp(URL.createObjectURL(file));
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
      const response = await axiosInstance.post('/setDp', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDpUrl(response.data.url + `?t=${new Date().getTime()}`);
      setIsEditingDp(false);
      setSelectedDpFile(null);
      setPreviewDp(null);
      setError(null);
    } catch (error) {
      console.error('Error updating DP:', error);
      setError(`Failed to update display picture: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleCancelDpEdit = () => {
    setIsEditingDp(false);
    setSelectedDpFile(null);
    setPreviewDp(null);
  };

  const handleDeleteDp = async () => {
    if (!window.confirm('Are you sure you want to delete your display picture?')) return;
    try {
      const response = await axiosInstance.delete('/deleteDp');
      if (response.status === 200) {
        setDpUrl('');
        setSelectedDpFile(null);
        setPreviewDp(null);
        setIsEditingDp(false);
        setError(null);
      } else {
        setError('Failed to delete display picture. Server returned an error.');
      }
    } catch (error) {
      console.error('Error deleting DP:', error);
      setError(`Error deleting display picture: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = "DELETE";
    const confirmation = prompt(`To confirm account deletion, please type "${confirmText}" in the box below. This action is irreversible.`);
    if (confirmation !== confirmText) {
        alert("Account deletion cancelled or confirmation text did not match.");
        return;
    }
    try {
      const response = await axiosInstance.post('/deleteAccount', { confirmDelete: user });
      if (response.status === 200) {
        alert('Account deleted successfully.');
        navigate('/login');
      } else {
        setError('Failed to delete account. Server returned an error.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(`Error deleting account: ${error.response?.data?.error || error.message}`);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  if (loading) return <div className={styles.loadingState}>Loading profile...</div>;
  

  return (
    <div className={styles.profileCardContainer}>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.profileHeaderBanner}></div>
      <div className={styles.profileGrid}>
        <aside className={styles.profileSidebar}>
          <div className={styles.dpWrapper}>
            <img
              className={styles.profileDp}
              src={previewDp || dpUrl || 'https://via.placeholder.com/180'}
              alt={`${user || 'User'}'s profile`}
            />
            {!isEditingDp && (
              <button className={styles.dpEditButton} onClick={() => setIsEditingDp(true)} aria-label="Edit display picture">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
          </div>

          {isEditingDp && (
            <div className={styles.dpEditControls}>
              <input type='file' onChange={handleFileChange} accept="image/*" className={styles.dpFileInput} />
              <div className={styles.dpEditActions}>
                <button onClick={handleSaveDp} className={`${styles.actionButtonSmall} ${styles.saveButtonSmall}`} disabled={!selectedDpFile}>
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
                <button onClick={handleCancelDpEdit} className={`${styles.actionButtonSmall} ${styles.cancelButtonSmall}`}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              </div>
              {dpUrl && (
                <button onClick={handleDeleteDp} className={`${styles.actionButtonSmall} ${styles.deleteButtonSmall}`}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Remove Current
                </button>
              )}
            </div>
          )}

          <h1 className={styles.profileUsername}>{user || 'Username'}</h1>
          
          <nav className={styles.profileActions}>
            <button className={styles.actionButton} onClick={() => navigate('/myBlogs')}>
              <FontAwesomeIcon icon={faBlog} className={styles.buttonIcon} /> My Blogs
            </button>
            <button className={styles.actionButton} onClick={() => navigate('/logMeal')}>
              <FontAwesomeIcon icon={faPlusCircle} className={styles.buttonIcon} /> Log New Meal
            </button>
            <button className={styles.actionButton} onClick={() => navigate('/mealsOverview')}>
              <FontAwesomeIcon icon={faFileAlt} className={styles.buttonIcon} /> Meals Overview
            </button>
            <button className={styles.actionButton} onClick={() => navigate('/CreateRecipe')}>
              <FontAwesomeIcon icon={faUtensils} className={styles.buttonIcon} /> Create Recipe
            </button>
            <button className={styles.actionButton} onClick={() => navigate('/Recipes')}>
              <FontAwesomeIcon icon={faBookOpen} className={styles.buttonIcon} /> View Recipes
            </button>
          </nav>

          <div className={styles.dangerZone}>
            <button className={styles.deleteAccountButton} onClick={handleDeleteAccount}>
              <FontAwesomeIcon icon={faSignOutAlt} className={styles.buttonIcon} /> Delete Account
            </button>
          </div>
        </aside>

        <main className={styles.profileContent}>
          <div className={styles.bioSectionHeader}>
            <h2 className={styles.bioTitle}>About Me</h2>
            {!isEditingBio && (
              <button className={styles.bioEditIcon} onClick={handleBioEditToggle} aria-label="Edit bio">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
          </div>

          {isEditingBio ? (
            <div className={styles.bioEditSection}>
              <ReactQuill
                theme='snow'
                value={currentBio}
                onChange={setCurrentBio}
                modules={quillModules}
                className={styles.quillEditor}
              />
              <div className={styles.bioEditActions}>
                <button onClick={handleSaveBio} className={`${styles.actionButton} ${styles.saveButton}`}>
                  <FontAwesomeIcon icon={faSave} /> Save Bio
                </button>
                <button onClick={handleBioEditToggle} className={`${styles.actionButton} ${styles.cancelButton}`}>
                  <FontAwesomeIcon icon={faTimes} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.bioDisplay}>
              {bio ? parse(bio) : <p>No bio set yet. Click the edit icon to add one!</p>}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfileCard;
