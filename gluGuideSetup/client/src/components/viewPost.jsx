import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import parse from 'html-react-parser';
import CommentsSection from './CommentsSection';
import styles from '../styles/SingleBlog.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndStatus = async () => {
      setLoading(true);
      setAuthLoading(true);
      try {
        const postResponse = await axiosInstance.get(`/getUserPost/${id}`, {
          withCredentials: true,
        });
        setPost(postResponse.data || {});

        const statusResponse = await fetch(`${API_BASE_URL}/status`, { credentials: 'include' });
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setIsLoggedIn(statusData.valid);
        } else {
          console.error("Error fetching session status, response not OK:", statusResponse.status);
          setIsLoggedIn(false);
        }

      } catch (err) {
        setError('Failed to load post or session status');
        console.error(
          'Error loading post or status:',
          err.response ? err.response.data : err.message
        );
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
        setAuthLoading(false);
      }
    };
    fetchPostAndStatus();
  }, [id]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      const response = await axiosInstance.post(
        `/toggleLike/${id}`,
        {},
        { withCredentials: true }
      );
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likesCount
          ? Array(response.data.likesCount).fill('user')
          : [],
        likesCount: response.data.likesCount
      }));
      setInfoMessage('');
    } catch (err) {
      if (err.response?.data.message) {
        setInfoMessage(err.response.data.message);
      } else {
        console.error('Error liking post:', err);
        setInfoMessage('An error occurred while liking the post.');
      }
    }
  };

  const handleAuthorClick = (authorUsername) => {
    navigate(`/profile/${authorUsername}`);
  };

  if (loading || authLoading) return <p className={styles.loadingMessage}>Loading post...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (!post) return <p className={styles.errorMessage}>Post not found.</p>;

  // Determine like button text and functionality
  let likeButtonContent;
  const currentLikes = post.likesCount !== undefined ? post.likesCount : (post.likes ? post.likes.length : 0);
  if (!isLoggedIn) {
    likeButtonContent = "Login to like this post!";
  } else {
    likeButtonContent = (
      <>
        <FontAwesomeIcon icon={faHeart} className={styles.heart} /> {' '}
        {currentLikes} Like{currentLikes !== 1 && 's'}
      </>
    );
  }

  return (
    <div className={styles.viewPostContainer}>
      <div className={styles.contentRectangle}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <button
          onClick={() => handleAuthorClick(post.username)}
          className={styles.authorButton} 
        >
          Author: {post.username}
        </button>
        <p className={styles.postDate}>
          Created on: {new Date(post.created_at).toLocaleDateString()}
        </p>
        {post.updated_at && (
          <p className={styles.postDate}>
            Last Edited: {new Date(post.updated_at).toLocaleString()}
          </p>
        )}
        
        {post.tags && post.tags.length > 0 && (
            <div className={styles.tagsContainer}> 
                {post.tags.map((tag, index) => (
                    <button 
                        key={index} 
                        className={styles.tagItem} 
                        onClick={(e) => { 
                            e.stopPropagation();
                            navigate(`/blogs?tag=${encodeURIComponent(tag)}`);
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        )}

      <div className={styles.postContainerBody}>
        {post.post_picture && (
          <img
            src={`${API_BASE_URL}/uploads/${post.post_picture}`}
            alt="Blog post"
            className={styles.image}
          />
        )}
        <div className={styles.postContainerContentBox}>
          {post.content && parse(post.content)}
        </div>
      </div>
        <button onClick={handleLike} className={styles.likeButton}>
          {likeButtonContent}
        </button>
        {infoMessage && <p className={styles.infoMessage}>{infoMessage}</p>}
      </div>

      <CommentsSection postId={id} />
    </div>
  );
};

export default ViewPost;
