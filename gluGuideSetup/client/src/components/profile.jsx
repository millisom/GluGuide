import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logout from './logout';

const Profile = () => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
    useEffect(() => {
      axios.get('http://localhost:8080/user')
      .then(res => {
        if (res.data.valid) {
          setUser(res.data.username);
          navigate('/account');
        }else{
          navigate('/login');
          console.log('User:', res.data);
        }
        setLoading(false);
      })
      .catch(err => console.error('Error:', err));
      setLoading(false);
    }, [navigate]);
    if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Profile</h1>
      {user ? <p>Welcome, {user}!</p> : <p>No user data available.</p>}
      <Logout />
    </div>
  );
};

export default Profile;