import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/Admin.module.css';

const AdminCreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setMessage('Terms must be accepted.');
      return;
    }

    try {
      const res = await axiosInstance.post(
        '/createUser',
        { username, email, password, termsAccepted, is_admin: isAdmin },
        { withCredentials: true }
      );

      setMessage(`User created successfully: ${res.data.username}`);
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className={styles.formAdminCreate}>
      <h1 className={styles.title}>Create New User</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div className={styles.inputField}>
          <label className={styles.label}>Username</label>
          <input
            type='text'
            className={styles.input}
            placeholder='Username'
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.inputField}>
          <label className={styles.label}>Email</label>
          <input
            type='email'
            className={styles.input}
            placeholder='Email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputField}>
          <label className={styles.label}>Password</label>
          <input
            type='password'
            className={styles.input}
            placeholder='Password'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <label className={styles.labelCheckbox}>
          <input
            type='checkbox'
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className={styles.iconSpacing}
          />
          I accept the Terms and Conditions
        </label>

        <label className={styles.labelCheckbox}>
          <input
            type='checkbox'
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className={styles.iconSpacing}
          />
          Make Admin
        </label>

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
            <FontAwesomeIcon icon={faUserPlus} className={styles.iconSpacing} />
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateUser;
