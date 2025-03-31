import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '', is_admin: false });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch all users and filter out the one with matching id.
  // (For simplicity, we use the /admin/users endpoint to get all users,
  //  then pick the one we need. In a production app, you might have a dedicated GET endpoint.)
  useEffect(() => {
    fetch('http://localhost:8080/admin/users', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const foundUser = data.find((u) => u.id === parseInt(id, 10));
        if (foundUser) {
          setUser(foundUser);
        } else {
          setMessage('User not found.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setMessage('Error fetching user data.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`http://localhost:8080/admin/user/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      });
      if (res.ok) {
        setMessage('User updated successfully!');
        setTimeout(() => navigate('/admin/users'), 1500);
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error || 'Something went wrong.'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Username: 
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Email: 
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Admin: 
            <input
              type="checkbox"
              checked={user.is_admin}
              onChange={(e) => setUser({ ...user, is_admin: e.target.checked })}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ marginRight: '10px' }}>Update User</button>
        <Link to="/admin/users">Cancel</Link>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default AdminEditUser;
