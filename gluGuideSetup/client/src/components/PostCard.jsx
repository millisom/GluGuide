import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import PostTags from './PostTags';
import styles from '../styles/ViewBlogEntries.module.css';

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

export default PostCard; 