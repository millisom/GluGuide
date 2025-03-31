import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    setMessage('');

    try {
      const res = await fetch('http://localhost:8080/admin/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password, termsAccepted, is_admin: isAdmin }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`User created successfully: ${data.username}`);
        setTimeout(() => navigate('/admin/users'), 1500);
      } else {
        setMessage(`Error: ${data.error || 'Something went wrong.'}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create New User</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          /> Terms Accepted
        </label>

        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          /> Make Admin
        </label>

        <button type="submit">Create User 🚀</button>
      </form>

      {message && <p>{message}</p>}

      <Link to="/admin/users">← Back to User List</Link>
    </div>
  );
};

export default AdminCreateUser;
