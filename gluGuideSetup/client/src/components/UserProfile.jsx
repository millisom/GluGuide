import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import parse from 'html-react-parser'; // Import the parser
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

  if (loading) return <p className={styles.loadingMessage}>Loading profile...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.contentRectangle}>
        <div className={styles.profileHeader}>
          {authorData.user.profile_picture ? (
            <img
              src={authorData.user.profile_picture} // Use backend URL for the image
              alt={`${authorData.user.username}'s profile`}
              className={styles.profilePicture}
            />
          ) : (
            <div className={styles.profilePicturePlaceholder}>No Image</div>
          )}
          <h2 className={styles.profileUsername}>{authorData.user.username}</h2>
        </div>
        <div className={styles.profileBio}>
          {authorData.user.profile_bio
            ? parse(authorData.user.profile_bio)
            : 'No bio available'}
        </div>
      </div>
      <div className={styles.postsSection}>
        <h3>Posts by {authorData.user.username}</h3>
        {authorData.posts.length > 0 ? (
          <ul className={styles.postsList}>
            {authorData.posts.map((post) => (
              <li
                key={post.id}
                className={styles.postItem}
                onClick={() => handlePostClick(post.id)} // Make each post clickable
              >
                <h4 className={styles.postTitle}>{post.title}</h4>
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
