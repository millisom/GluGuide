import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ViewBlogEntries from '../../src/components/ViewBlogEntries';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock react-router-dom
vi.mock('react-router-dom', () => {
  // Track current location for testing
  let currentLocation = { search: '?tag=react', pathname: '/blogs' };
  const mockNavigate = vi.fn((path) => {
    if (typeof path === 'string') {
      currentLocation.pathname = path.split('?')[0];
      currentLocation.search = path.includes('?') ? path.split('?')[1] : '';
    }
  });
  
  return {
    useNavigate: () => mockNavigate,
    useLocation: () => currentLocation
  };
});

// Mock child components
vi.mock('../../src/components/TagFilter', () => ({
  default: ({ selectedTags, clearAllTags, handleTagMultiSelectChange, handleTagRemove }) => (
    <div data-testid="tag-filter">
      {selectedTags.map(tag => (
        <span key={tag} data-testid={`tag-${tag}`}>{tag}</span>
      ))}
      <button data-testid="clear-tags" onClick={clearAllTags}>Clear Tags</button>
      <button data-testid="remove-tag" onClick={() => handleTagRemove(selectedTags[0])}>Remove Tag</button>
      <button data-testid="select-tag" onClick={() => handleTagMultiSelectChange([{ value: 'css', label: 'css' }])}>Select Tag</button>
    </div>
  )
}));

vi.mock('../../src/components/PostCard', () => ({
  default: ({ post, handleViewClick, handleAdminDelete }) => (
    <div data-testid={`post-${post.id}`} className="post-card">
      <h3>{post.title}</h3>
      <p>By: {post.username}</p>
      <button data-testid={`view-${post.id}`} onClick={() => handleViewClick(post.id)}>View</button>
      <button data-testid={`delete-${post.id}`} onClick={() => handleAdminDelete(post.id)}>Delete</button>
    </div>
  )
}));

// Mock CSS module
vi.mock('../../src/styles/ViewBlogEntries.module.css', () => ({
  default: {
    viewBlogEntries: 'viewBlogEntries',
    title: 'title',
    filterContainer: 'filterContainer',
    searchInput: 'searchInput',
    error: 'error',
    noPostsFound: 'noPostsFound',
    postContainer: 'postContainer'
  }
}), { virtual: true });

describe('ViewBlogEntries Component', () => {
  const mockPosts = [
    {
      id: 1,
      title: 'First Post',
      username: 'user1',
      created_at: '2023-05-15T10:00:00Z',
      tags: ['react', 'javascript']
    },
    {
      id: 2,
      title: 'Second Post',
      username: 'user2',
      created_at: '2023-05-14T10:00:00Z',
      tags: ['css', 'html']
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful admin status check
    axios.get.mockImplementation((url) => {
      if (url.includes('/status')) {
        return Promise.resolve({ data: { is_admin: true } });
      }
      if (url.includes('/getAllPosts')) {
        return Promise.resolve({ data: mockPosts });
      }
      if (url.includes('/tags')) {
        return Promise.resolve({ data: ['react', 'javascript', 'css', 'html'] });
      }
      return Promise.reject(new Error('Not found'));
    });

    // Mock window confirm
    window.confirm = vi.fn().mockReturnValue(true);
    window.alert = vi.fn();
    
    // Clean up any lingering timers
    vi.clearAllTimers();
  });

  it('renders blog entries after successful fetch', async () => {
    render(<ViewBlogEntries />);
    
    // Initially should show loading or no content
    expect(screen.queryByText('Explore Blog Entries')).toBeInTheDocument();
    
    // After posts load
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });
  
  it('initializes with tag from URL query parameter', async () => {
    render(<ViewBlogEntries />);
    
    // Should initialize with 'react' tag from URL
    await waitFor(() => {
      expect(screen.getByTestId('tag-react')).toBeInTheDocument();
    });
  });
  
  it('handles non-admin user correctly', async () => {
    // Mock non-admin user
    axios.get.mockImplementation((url) => {
      if (url.includes('/status')) {
        return Promise.resolve({ data: { is_admin: false } });
      }
      if (url.includes('/getAllPosts')) {
        return Promise.resolve({ data: mockPosts });
      }
      if (url.includes('/tags')) {
        return Promise.resolve({ data: ['react', 'javascript', 'css', 'html'] });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(<ViewBlogEntries />);
    
    // Posts should still load for non-admin users
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
    });
  });
  
  it('handles error during admin status check', async () => {
    // Mock error during admin check
    axios.get.mockImplementation((url) => {
      if (url.includes('/status')) {
        return Promise.reject(new Error('Failed to check admin status'));
      }
      if (url.includes('/getAllPosts')) {
        return Promise.resolve({ data: mockPosts });
      }
      if (url.includes('/tags')) {
        return Promise.resolve({ data: ['react', 'javascript', 'css', 'html'] });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(<ViewBlogEntries />);
    
    // Posts should still load even if admin check fails
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
    });
  });
  
  it('handles error during tags fetch', async () => {
    // Mock error during tags fetch
    axios.get.mockImplementation((url) => {
      if (url.includes('/status')) {
        return Promise.resolve({ data: { is_admin: true } });
      }
      if (url.includes('/getAllPosts')) {
        return Promise.resolve({ data: mockPosts });
      }
      if (url.includes('/tags')) {
        return Promise.reject(new Error('Failed to fetch tags'));
      }
      return Promise.reject(new Error('Not found'));
    });
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ViewBlogEntries />);
    
    // Posts should still load even if tags fetch fails
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
  
  it('handles filtering by search term', async () => {
    render(<ViewBlogEntries />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });
    
    // Find the search input
    const searchInput = screen.getByPlaceholderText('Search by title or author...');
    
    // Search for a specific user
    fireEvent.change(searchInput, { target: { value: 'user1' } });
    
    // Should only show posts matching the search
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
      expect(screen.queryByTestId('post-2')).not.toBeInTheDocument();
    });
    
    // Search for a different user
    fireEvent.change(searchInput, { target: { value: 'user2' } });
    
    // Should show the other post
    await waitFor(() => {
      expect(screen.queryByTestId('post-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
    });
    
    // Search for a title
    fireEvent.change(searchInput, { target: { value: 'First' } });
    
    // Should filter by title too
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
      expect(screen.queryByTestId('post-2')).not.toBeInTheDocument();
    });
  });
  
  it('handles tag filtering', async () => {
    render(<ViewBlogEntries />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });
    
    // Simulate selecting a tag through TagFilter
    fireEvent.click(screen.getByTestId('select-tag'));
    
    // Should only show posts with that tag
    await waitFor(() => {
      expect(screen.queryByTestId('post-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
    });
    
    // Clear all tags
    fireEvent.click(screen.getByTestId('clear-tags'));
    
    // Should show all posts again
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
    });
    
    // Test removing a specific tag
    // First add a tag
    fireEvent.click(screen.getByTestId('select-tag'));
    
    // Wait for filtering to happen
    await waitFor(() => {
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
    });
    
    // Now remove the tag
    fireEvent.click(screen.getByTestId('remove-tag'));
    
    // Should show all posts again
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
    });
  });
  
  it('handles post deletion', async () => {
    axios.delete.mockResolvedValue({ data: { message: 'Post deleted successfully' } });
    
    render(<ViewBlogEntries />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
    });
    
    // Delete a post
    fireEvent.click(screen.getByTestId('delete-1'));
    
    // Should prompt for confirmation
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this post?');
    
    // Should make delete request
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:8080/admin/posts/1', { withCredentials: true });
    
    // Should show success message and remove post
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Post deleted successfully!');
      expect(screen.queryByTestId('post-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('post-2')).toBeInTheDocument();
    });
  });
  
  it('handles cancellation of post deletion', async () => {
    window.confirm.mockReturnValueOnce(false);
    axios.delete.mockResolvedValue({ data: { message: 'Post deleted successfully' } });
    
    render(<ViewBlogEntries />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
    });
    
    // Try to delete a post but cancel
    fireEvent.click(screen.getByTestId('delete-1'));
    
    // Should have prompted for confirmation
    expect(window.confirm).toHaveBeenCalled();
    
    // Should not make delete request
    expect(axios.delete).not.toHaveBeenCalled();
    
    // Post should still be displayed
    expect(screen.getByTestId('post-1')).toBeInTheDocument();
  });
  
  it('handles error during post deletion', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.delete.mockRejectedValueOnce(new Error('Failed to delete post'));
    
    render(<ViewBlogEntries />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
    });
    
    // Delete a post
    fireEvent.click(screen.getByTestId('delete-1'));
    
    // Should log error and show error message
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Failed to delete post.');
    });
    
    consoleSpy.mockRestore();
  });
  
  it('handles error when fetching posts', async () => {
    // Mock error response for posts
    axios.get.mockImplementation((url) => {
      if (url.includes('/getAllPosts')) {
        return Promise.reject(new Error('Failed to fetch posts'));
      }
      // Return success for other requests
      return Promise.resolve({ data: {} });
    });
    
    render(<ViewBlogEntries />);
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch posts')).toBeInTheDocument();
    });
  });
  
  it('shows message when no posts match filters', async () => {
    render(<ViewBlogEntries />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });
    
    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search by title or author...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Should show no posts message
    await waitFor(() => {
      expect(screen.getByText('No posts match your search or filters.')).toBeInTheDocument();
    });
  });
  
  it('handles clicking on post view button', async () => {
    render(<ViewBlogEntries />);
    
    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
    });
    
    // Click view button
    fireEvent.click(screen.getByTestId('view-1'));
    
    // Should navigate to post view page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/blogs/view/1');
    });
  });
}); 