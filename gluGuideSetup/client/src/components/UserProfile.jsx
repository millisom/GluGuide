import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/UserProfile.module.css';

const UserProfile = () => {
  const { username } = useParams(); // Get the username from the route
  const [authorData, setAuthorData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For navigation to single blog view

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/profile/${username}`);
        setAuthorData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load user profile');
        console.error(
          'Error loading profile:',
          error.response ? error.response.data : error.message
        );
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handlePostClick = (postId) => {
    navigate(`/blogs/view/${postId}`); // Redirect to the single blog view
  };

  if (loading) return <p className={styles.loading}>Loading profile...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        {authorData.user.profile_picture ? (
          <img
            src={`http://localhost:8080/uploads/${authorData.user.profile_picture}`}
            alt={`${authorData.user.username}'s profile`}
            className={styles.profilePicture}
          />
        ) : (
          <div className={styles.profilePicturePlaceholder}>No Image</div>
        )}
        <h1 className={styles.username}>{authorData.user.username}</h1>
        <p className={styles.bio}>{authorData.user.profile_bio || 'No bio available'}</p>
      </div>
      <div className={styles.postsSection}>
        <h2>Posts by {authorData.user.username}</h2>
        {authorData.posts.length > 0 ? (
          <ul className={styles.postsList}>
            {authorData.posts.map((post) => (
              <li
                key={post.id}
                className={styles.postItem}
                onClick={() => handlePostClick(post.id)} // Make each post clickable
                style={{ cursor: 'pointer' }} // Add visual feedback for clickable items
              >
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDate}>
                  Created on {new Date(post.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noPosts}>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
