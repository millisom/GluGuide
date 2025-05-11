import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import TagFilter from './TagFilter';
import PostCard from './PostCard';
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

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get('http://localhost:8080/status', { withCredentials: true });
        setIsAdmin(res.data.is_admin);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  // Fetch all posts
  useEffect(() => {
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

  // Fetch all tags
  useEffect(() => {
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

  // Check URL for initial tag filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagFromUrl = params.get('tag');
    if (tagFromUrl && !selectedTags.includes(tagFromUrl)) {
      setSelectedTags([tagFromUrl]); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Handle filtering posts
  useEffect(() => {
    const filterPosts = () => {
      let postsToFilter = [...allPosts];

      // Filter by search (title or username)
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        postsToFilter = postsToFilter.filter(post => 
          post.title.toLowerCase().includes(lowerSearchTerm) ||
          post.username.toLowerCase().includes(lowerSearchTerm)
        );
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        postsToFilter = postsToFilter.filter(post => 
          selectedTags.every(filterTag => post.tags && post.tags.includes(filterTag))
        );
      }

      setFilteredPosts(postsToFilter);
    };

    filterPosts();
  }, [allPosts, searchTerm, selectedTags]);

  // Handle post deletion
  const handleAdminDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:8080/admin/posts/${postId}`, {
          withCredentials: true,
        });
        alert('Post deleted successfully!');
        // Refresh the posts list after deletion
        setAllPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  // Tag filtering handlers
  const handleTagMultiSelectChange = (selectedOptions) => {
    setSelectedTags(selectedOptions ? selectedOptions.map(option => option.value) : []);
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Navigation handler
  const handleViewClick = (postId) => {
    navigate(`/blogs/view/${postId}`);
  };

  // Prepare tag options for react-select
  const tagOptions = availableTags.map(tag => ({ value: tag, label: tag }));
  const selectedTagValues = selectedTags.map(tag => ({ value: tag, label: tag }));

  // Memoize posts to prevent unnecessary re-renders
  const memoizedPosts = useMemo(() => filteredPosts, [filteredPosts]);

  return (
    <div className={styles.viewBlogEntries}>
      <h2 className={styles.title}>Explore Blog Entries</h2>

      {/* Filter Controls */}
      <div className={styles.filterContainer}>
        <input 
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        
        <TagFilter 
          tagOptions={tagOptions}
          selectedTags={selectedTags}
          selectedTagValues={selectedTagValues}
          handleTagMultiSelectChange={handleTagMultiSelectChange}
          handleTagRemove={handleTagRemove}
          clearAllTags={clearAllTags}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {memoizedPosts.length === 0 && !error ? (
        <p className={styles.noPostsFound}>No posts match your search or filters.</p>
      ) : (
        <div className={styles.postContainer}>
          {memoizedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isAdmin={isAdmin}
              handleViewClick={handleViewClick}
              handleAdminDelete={handleAdminDelete}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBlogEntries;
