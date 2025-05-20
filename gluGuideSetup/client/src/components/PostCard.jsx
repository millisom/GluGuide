import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import PostTags from './PostTags';
import styles from '../styles/ViewBlogEntries.module.css';
const API_BASE_URL = import.meta.env.VITE_API_URL;


const PostCard = ({ 
  post, 
  isAdmin, 
  handleViewClick, 
  handleAdminDelete, 
  selectedTags, 
  setSelectedTags 
}) => {
  return (
    <div key={post.id} className={styles.postCard}>
      <div
        className={styles.postContent}
        onClick={() => handleViewClick(post.id)}
      >
        {post.post_picture && (
          <div className={styles.postImage}>
            <img
              src={`${API_BASE_URL}/uploads/${post.post_picture}`}
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
            <span>{post.likes_count ? post.likes_count : (post.likes ? post.likes.length : 0)}</span>
          </div>
        </div>
        {post.tags && post.tags.length > 0 && (
          <PostTags 
            tags={post.tags} 
            selectedTags={selectedTags} 
            setSelectedTags={setSelectedTags} 
          />
        )}
      </div>

      {isAdmin && (
        <div className={styles.adminActions}>
          <button
            className={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/admin/editPost/${post.id}`;
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
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.any.isRequired,
    post_picture: PropTypes.string,
    title: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    likes_count: PropTypes.number,
    likes: PropTypes.array,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isAdmin: PropTypes.bool,
  handleViewClick: PropTypes.func.isRequired,
  handleAdminDelete: PropTypes.func,
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  setSelectedTags: PropTypes.func.isRequired,
};

PostCard.defaultProps = {
  isAdmin: false,
  handleAdminDelete: () => {},
  selectedTags: [],
};

export default PostCard; 