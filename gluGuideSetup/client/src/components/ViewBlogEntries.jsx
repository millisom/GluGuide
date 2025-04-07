import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ViewBlogEntries.module.css';

const ViewBlogEntries = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin status
    axios
      .get('http://localhost:8080/status', { withCredentials: true })
      .then((res) => setIsAdmin(res.data.is_admin))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    // Fetch all posts
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getAllPosts', {
          withCredentials: true,
        });

        // Sort posts by creation time, most recent first
        const sortedPosts = response.data?.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts || []);
      } catch (error) {
        setError('Failed to fetch posts');
        console.error(
          'Error fetching posts:',
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchPosts();
  }, []);

  const handleAdminDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:8080/admin/posts/${postId}`, {
          withCredentials: true,
        });
        alert('Post deleted successfully!');
        // Refresh the posts list after deletion
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  // Memoize posts to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => posts, [posts]);

  const handleViewClick = (postId) => {
    navigate(`/blogs/view/${postId}`);
  };

  return (
    <div className={styles.viewBlogEntries}>
      <h2 className={styles.title}>Explore Blog Entries</h2>
      {memoizedPosts.length === 0 ? (
        <p className={styles.noPostsFound}>No posts found.</p>
      ) : (
        <div className={styles.postContainer}>
          {memoizedPosts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              <div
                className={styles.postContent}
                onClick={() => handleViewClick(post.id)}
              >
                {post.post_picture && (
                  <div className={styles.postImage}>
                    <img
                      src={`http://localhost:8080/uploads/${post.post_picture}`}
                      alt={post.title}
                      loading='lazy'
                    />
                  </div>
                )}
                <h4 className={styles.postTitle}>{post.title}</h4>
                <div className={styles.postDetails}>
                  <p className={styles.postInfo}>Author: {post.username}</p>
                  <p className={styles.postInfo}>
                    Created on:{' '}
                    {new Date(post.created_at).toLocaleDateString('en-US')}
                  </p>
                  <div className={styles.postLikes}>
                    <span className={styles.likeIcon}>
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={styles.heart}
                      />
                    </span>
                    <span>{post.likes ? post.likes.length : 0}</span>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className={styles.adminActions}>
                  <button
                    className={styles.editButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/editPost/${post.id}`);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdminDelete(post.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default ViewBlogEntries;
