import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from '../styles/Admin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // We'll store user data (username, email, is_admin, bio) in `user`,
  // but store the avatar URL separately, just like in ProfileCard.
  const [user, setUser] = useState({
    username: '',
    email: '',
    is_admin: false,
    profile_bio: '',
  });
  const [avatarUrl, setAvatarUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchUserData = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/user/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await res.json();
      setUser({
        username: data.username || '',
        email: data.email || '',
        is_admin: data.is_admin || false,
        profile_bio: data.profile_bio || '',
      });
    } catch (err) {
      console.error(err);
      setMessage('Error fetching user data.');
    }
  };

  const fetchUserAvatar = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/user/${id}/avatar`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch avatar.');
      }

      setAvatarUrl(data.url || '');
    } catch (err) {
      console.error('Error fetching user avatar:', err);
      setAvatarUrl('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserData().then(() => {
      fetchUserAvatar();
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const bodyData = { ...user };
    if (newPassword.trim()) {
      bodyData.newPassword = newPassword;
    }

    try {
      const res = await fetch(`http://localhost:8080/admin/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong.');
      }

      setMessage('User updated successfully!');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleRemoveAvatar = async () => {
    if (
      !window.confirm('Are you sure you want to remove this users avatar?')
    ) {
      return;
    }
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8080/admin/user/${id}/avatar`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to remove avatar.');
      }

      setAvatarUrl('');
      setMessage('User avatar removed successfully.');
    } catch (err) {
      setMessage(err.message || 'Error removing avatar.');
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading user data...</p>;
  }

  return (
    <div className={styles.formAdminCreate}>
      <h1 className={styles.title}>Edit User</h1>
      <br />
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className={styles.inputField}>
          <label className={styles.label}>Username</label>
          <input
            type='text'
            className={styles.input}
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
          />
        </div>

        {/* Email */}
        <div className={styles.inputField}>
          <label className={styles.label}>Email</label>
          <input
            type='email'
            className={styles.input}
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        {/* Admin checkbox */}
        <div className={styles.inputField}>
          <label className={styles.labelCheckbox}>
            <input
              type='checkbox'
              checked={user.is_admin}
              onChange={(e) => setUser({ ...user, is_admin: e.target.checked })}
              className={styles.iconSpacing}
            />
            Make Admin
          </label>
        </div>

        {/* Bio with React Quill */}
        <div className={styles.inputField}>
          <label className={styles.label}>Bio</label>
          <ReactQuill
            value={user.profile_bio}
            onChange={(value) => setUser({ ...user, profile_bio: value })}
            theme="snow"
            // Adjust className and styling as needed:
            className={styles.input}
          />
        </div>

        {/* New Password */}
        <div className={styles.inputField}>
          <label className={styles.label}>New Password</label>
          <input
            type='password'
            className={styles.input}
            placeholder='Leave empty to keep current password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Avatar display */}
        <div className={styles.inputField}>
          <label className={styles.label}>Avatar</label>
          {avatarUrl ? (
            <div className={styles.avatarPreview}>
              <img
                src={avatarUrl}
                alt='User avatar'
                className={styles.avatarImage}
              />
            </div>
          ) : (
            <p>No avatar set.</p>
          )}
          <button
            type='button'
            className={styles.deleteButton}
            onClick={handleRemoveAvatar}
            disabled={!avatarUrl}
          >
            <FontAwesomeIcon icon={faTrash} className={styles.iconSpacing} />
            Remove Avatar
          </button>
        </div>

        {/* Messages */}
        {message && (
          <p
            className={styles.message}
            style={{
              color: message.includes('successfully') ? 'green' : 'red',
            }}
          >
            {message}
          </p>
        )}

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            type='button'
            className={styles.secondaryButton}
            onClick={() => navigate('/admin')}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={styles.iconSpacing}
            />
            Back to Dashboard
          </button>
          <button type='submit' className={styles.primaryButton}>
            <FontAwesomeIcon icon={faSave} className={styles.iconSpacing} />
            Update User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditUser;
