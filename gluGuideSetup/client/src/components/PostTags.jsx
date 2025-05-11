import styles from '../styles/ViewBlogEntries.module.css';

const PostTags = ({ tags, selectedTags, setSelectedTags }) => {
  return (
    <div className={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <button 
          key={index} 
          className={`${styles.tagItem} ${selectedTags.includes(tag) ? styles.selectedTagInCard : ''}`}
          onClick={(e) => {
            e.stopPropagation(); 
            if (!selectedTags.includes(tag)) {
              setSelectedTags([...selectedTags, tag]);
            }
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default PostTags; 