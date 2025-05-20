import PropTypes from 'prop-types';
import styles from '../styles/ViewBlogEntries.module.css';

const PostTags = ({ tags, selectedTags, setSelectedTags }) => {
  return (
    <div className={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <button 
          key={index} 
          className={`${styles.tagItem} ${selectedTags && selectedTags.includes(tag) ? styles.selectedTagInCard : ''}`}
          onClick={(e) => {
            e.stopPropagation(); 
            setSelectedTags(tag);
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

PostTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  setSelectedTags: PropTypes.func.isRequired,
};

PostTags.defaultProps = {
    selectedTags: [],
};

export default PostTags; 