import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEdit,
  faTrash,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Admin.module.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchUsers = () => {
    fetch('http://localhost:8080/admin/users', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      fetch(`http://localhost:8080/admin/user/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then(async (res) => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Failed to delete user.');
          }

          return data;
        })
        .then((data) => {
          setMessage(data.message);
          fetchUsers();
        })
        .catch((err) => {
          setMessage(err.message || 'Error deleting user.');
        });
    }
  };

  if (loading) return <p className={styles.loading}>Loading users...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.adminArea}>
      <div className={styles.adminContainer}>
        <section className={styles.card}>
          <div className={styles.cardBody}>
            <h2 className={styles.title}>Admin Dashboard</h2>
            <p className={styles.infoText}>
              Welcome! Here you can manage users, including creating, editing,
              or deleting accounts.
            </p>
            <button
              className={styles.squareButton}
              onClick={() => navigate('/admin/createUser')}
            >
              <FontAwesomeIcon
                icon={faUserPlus}
                className={styles.iconSpacing}
              />
              Create New User
            </button>
          </div>
        </section>
      </div>

      <section className={styles.card}>
        <div className={styles.cardBody}>
          <h2 className={styles.title}>User Management</h2>
          {message && <p className={styles.successMessage}>{message}</p>}
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Admin?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    {user.is_admin ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={styles.positiveIcon}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faXmark}
                        className={styles.negativeIcon}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => navigate(`/admin/editUser/${user.id}`)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
