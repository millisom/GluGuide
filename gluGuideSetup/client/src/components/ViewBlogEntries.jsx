import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faHeart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import styles from '../styles/ViewBlogEntries.module.css';

const ViewBlogEntries = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

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
        setAllPosts(sortedPosts || []);
        setFilteredPosts(sortedPosts || []);
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

  useEffect(() => {
    // get all available tags
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tags', {
          withCredentials: true,
        });
        setAvailableTags(response.data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // chekc initial tag filter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagFromUrl = params.get('tag');
    if (tagFromUrl && !selectedTags.includes(tagFromUrl)) {
      setSelectedTags([tagFromUrl]); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]); 

  useEffect(() => {
    let postsToFilter = [...allPosts];

    // filter by search (title or username)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      postsToFilter = postsToFilter.filter(post => 
        post.title.toLowerCase().includes(lowerSearchTerm) ||
        post.username.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // filtr by selected tags
    if (selectedTags.length > 0) {
      postsToFilter = postsToFilter.filter(post => 
        selectedTags.every(filterTag => post.tags && post.tags.includes(filterTag))
      );
    }

    setFilteredPosts(postsToFilter);

  }, [allPosts, searchTerm, selectedTags]);

  const handleAdminDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:8080/admin/posts/${postId}`, {
          withCredentials: true,
        });
        alert('Post deleted successfully!');
        // Refresh the posts list after deletion
        setAllPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        setFilteredPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  // Memoize posts to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => filteredPosts, [filteredPosts]);

  const handleViewClick = (postId) => {
    navigate(`/blogs/view/${postId}`);
  };

  // handler for react-select
  const handleTagMultiSelectChange = (selectedOptions) => {
    setSelectedTags(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const tagOptions = availableTags.map(tag => ({ value: tag, label: tag }));

  const selectedTagValues = selectedTags.map(tag => ({ value: tag, label: tag }));

  return (
    <div className={styles.viewBlogEntries}>
      <h2 className={styles.title}>Explore Blog Entries</h2>

      {/* --- Filter Controls --- */} 
      <div className={styles.filterContainer}>
        <input 
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.tagFilterSection}>
          <h4 className={styles.filterTitle}>Filter by Tags:</h4>
          <Select
            isMulti
            options={tagOptions}
            value={selectedTagValues}
            onChange={handleTagMultiSelectChange}
            placeholder="Select tags..."
            classNamePrefix="react-select"
            className={styles.tagSelectDropdown}
          />

          {selectedTags.length > 0 && (
            <div className={styles.selectedTagsList}>
              <span className={styles.selectedTagsTitle}>Active Filters:</span>
              {selectedTags.map(tag => (
                <span key={tag} className={styles.selectedTagItem}>
                  {tag}
                  <button onClick={() => handleTagRemove(tag)} className={styles.removeTagButton}>
                     <FontAwesomeIcon icon={faTimes} size="xs" />
                  </button>
                </span>
              ))}
              <button onClick={clearAllTags} className={styles.clearAllButton}>
                  Clear All Tags
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>} 

      {memoizedPosts.length === 0 && !error ? (
        <p className={styles.noPostsFound}>No posts match your search or filters.</p>
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
                    <span>{post.likes_count ? post.likes_count : (post.likes ? post.likes.length : 0)}</span>
                  </div>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className={styles.tagsContainer}>
                    {post.tags.map((tag, index) => (
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
                )}
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
    </div>
  );
};

export default ViewBlogEntries;
