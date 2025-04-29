import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import parse from 'html-react-parser';
import CommentsSection from './CommentsSection';
import styles from '../styles/SingleBlog.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ViewPost = () => {
  const { id } = useParams(); // Extract post ID from the URL
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate(); // For navigation (e.g., to author profile)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getUserPost/${id}`, {
          withCredentials: true,
        });
        setPost(response.data || {});
      } catch (err) {
        setError('Failed to load post');
        console.error(
          'Error loading post:',
          err.response ? err.response.data : err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/toggleLike/${id}`,
        {},
        { withCredentials: true }
      );
      setPost((prevPost) => ({
        ...prevPost,
        likes: response.data.likesCount
          ? Array(response.data.likesCount).fill('user')
          : [],
      }));
      setInfoMessage('');
    } catch (err) {
      if (err.response?.data.message) {
        setInfoMessage(err.response.data.message);
      } else {
        console.error('Error liking post:', err);
      }
    }
  };

  const handleAuthorClick = (authorUsername) => {
    navigate(`/profile/${authorUsername}`);
  };

  if (loading) return <p className={styles.loadingMessage}>Loading post...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.viewPostContainer}>
      <div className={styles.contentRectangle}>
        <h2 className={styles.postTitle}>{post.title}</h2>
        <button
          onClick={() => handleAuthorClick(post.username)}
          className={styles.authorButton} // Styling similar to likeButton
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
              src={`http://localhost:8080/uploads/${post.post_picture}`}
              alt="Blog post"
              className={styles.image}
            />
          )}
          <div className={styles.postContainerContentBox}>
            {parse(post.content)}
          </div>
        </div>
        <button onClick={handleLike} className={styles.likeButton}>
          <FontAwesomeIcon icon={faHeart} className={styles.heart} />{' '}
          {post.likes ? post.likes.length : 0} Like
          {post.likes?.length !== 1 && 's'}
        </button>
        {infoMessage && <p className={styles.infoMessage}>{infoMessage}</p>}
      </div>

      <CommentsSection postId={id} />
    </div>
  );
};

export default ViewPost;
