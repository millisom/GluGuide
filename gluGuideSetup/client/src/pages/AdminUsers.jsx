import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Function to fetch users from the backend
  const fetchUsers = () => {
    fetch('http://localhost:8080/admin/users', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler to delete a user
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      fetch(`http://localhost:8080/admin/user/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to delete user');
          }
          return res.json();
        })
        .then(data => {
          setMessage(data.message);
          // Refresh the user list after deletion
          fetchUsers();
        })
        .catch(err => {
          setMessage(err.message);
        });
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-users-page" style={{ padding: '20px' }}>
      <h1>User Management</h1>
      {message && <p>{message}</p>}
      <table className="users-table" border="1" cellPadding="10">
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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{new Date(user.created_at).toLocaleString()}</td>
              <td>{user.is_admin ? "✅" : "❌"}</td>
              <td>
                <Link to={`/admin/editUser/${user.id}`}>Edit</Link>
                <button 
                  onClick={() => handleDelete(user.id)} 
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link to="/admin">← Back to Admin Dashboard</Link>
    </div>
  );
};

export default AdminUsers;
