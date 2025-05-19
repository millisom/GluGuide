import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ViewBlogEntries from '../../src/components/ViewBlogEntries';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// ✅ Fix for invalid React object error
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => {
    const iconName = icon?.iconName || 'unknown';
    return <span data-testid={`icon-${iconName}`} />;
  }
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => {
  const currentLocation = { search: '?tag=react', pathname: '/blogs' };
  return {
    useNavigate: () => mockNavigate,
    useLocation: () => currentLocation
  };
});

// Mock TagFilter component
vi.mock('../../src/components/TagFilter', () => ({
  default: function MockTagFilter(props) {
    const { selectedTags, clearAllTags, handleTagMultiSelectChange, handleTagRemove, tagOptions } = props;
    return (
      <div data-testid="tag-filter">
        {selectedTags.map(tag => (
          <span key={tag} data-testid={`tag-${tag}`}>{tag}</span>
        ))}
        <div data-testid="tag-options">
          {(tagOptions || []).map(option => (
            <span key={option.value} data-testid={`option-${option.value}`}>{option.label}</span>
          ))}
        </div>
        <button data-testid="clear-tags" onClick={clearAllTags}>Clear Tags</button>
        <button data-testid="remove-tag" onClick={() => handleTagRemove(selectedTags[0])}>Remove Tag</button>
        <button data-testid="select-tag" onClick={() => handleTagMultiSelectChange([{ value: 'css', label: 'css' }])}>Select Tag</button>
      </div>
    );
  }
}));

// Mock PostCard component
vi.mock('../../src/components/PostCard', () => ({
  default: function MockPostCard({ post, handleViewClick, handleAdminDelete }) {
    return (
      <div data-testid={`post-${post.id}`} className="post-card">
        <h3>{post.title}</h3>
        <p>By: {post.username}</p>
        <button data-testid={`view-${post.id}`} onClick={() => handleViewClick(post.id)}>View</button>
        <button data-testid={`delete-${post.id}`} onClick={() => handleAdminDelete(post.id)}>Delete</button>
      </div>
    );
  }
}));

// Mock CSS
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
    { id: 1, title: 'First Post', username: 'user1', created_at: '2023-05-15T10:00:00Z', tags: ['react', 'javascript'] },
    { id: 2, title: 'Second Post', username: 'user2', created_at: '2023-05-14T10:00:00Z', tags: ['css', 'html'] }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockImplementation((url) => {
      if (url.includes('/status')) return Promise.resolve({ data: { is_admin: true } });
      if (url.includes('/getAllPosts')) return Promise.resolve({ data: mockPosts });
      if (url.includes('/tags')) return Promise.resolve({ data: ['react', 'javascript', 'css', 'html'] });
      return Promise.reject(new Error('Not found'));
    });
    window.confirm = vi.fn().mockReturnValue(true);
    window.alert = vi.fn();
  });

  it('renders blog entries after fetch', async () => {
    render(<ViewBlogEntries />);
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  it('uses tag from URL query', async () => {
    render(<ViewBlogEntries />);
    await waitFor(() => {
      expect(screen.getByTestId('tag-react')).toBeInTheDocument();
    });
  });

  it('handles non-admin users', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/status')) return Promise.resolve({ data: { is_admin: false } });
      if (url.includes('/getAllPosts')) return Promise.resolve({ data: mockPosts });
      if (url.includes('/tags')) return Promise.resolve({ data: ['react'] });
      return Promise.reject(new Error('Not found'));
    });
    render(<ViewBlogEntries />);
    await waitFor(() => {
      expect(screen.getByTestId('post-1')).toBeInTheDocument();
    });
  });

  it('handles error during tag fetch', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockImplementation((url) => {
      if (url.includes('/tags')) return Promise.reject(new Error('Tag error'));
      if (url.includes('/status')) return Promise.resolve({ data: { is_admin: true } });
      return Promise.resolve({ data: mockPosts });
    });
    render(<ViewBlogEntries />);
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('filters posts by search input', async () => {
    render(<ViewBlogEntries />);
    await waitFor(() => expect(screen.getByText('First Post')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText('Search by title or author...');
    fireEvent.change(searchInput, { target: { value: 'user2' } });

    await waitFor(() => {
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    });
  });

  it('handles tag filtering interactions', async () => {
    render(<ViewBlogEntries />);
    await waitFor(() => expect(screen.getByText('First Post')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('select-tag'));
    await waitFor(() => expect(screen.getByText('Second Post')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('clear-tags'));
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('select-tag'));
    fireEvent.click(screen.getByTestId('remove-tag'));
    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  it('handles post deletion confirmation', async () => {
    axios.delete.mockResolvedValue({ data: { message: 'Post deleted successfully' } });
    render(<ViewBlogEntries />);
    await waitFor(() => expect(screen.getByTestId('post-1')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('delete-1'));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Post deleted successfully!');
    });
  });

  it('cancels deletion when declined', async () => {
    window.confirm.mockReturnValueOnce(false);
    render(<ViewBlogEntries />);
    await waitFor(() => expect(screen.getByTestId('post-1')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('delete-1'));
    expect(axios.delete).not.toHaveBeenCalled();
  });

  it('handles delete error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.delete.mockRejectedValue(new Error('Delete failed'));

    render(<ViewBlogEntries />);
    await waitFor(() => expect(screen.getByTestId('post-1')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('delete-1'));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to delete post.');
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('shows message when no results match search', async () => {
    render(<ViewBlogEntries />);
    await waitFor(() => expect(screen.getByText('First Post')).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText('Search by title or author...'), { target: { value: 'zzz' } });
    await waitFor(() => {
      expect(screen.getByText('No posts match your search or filters.')).toBeInTheDocument();
    });
  });

  it('navigates to post view on View button click', async () => {
    render(<ViewBlogEntries />);
    await waitFor(() => expect(screen.getByTestId('view-1')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('view-1'));
    expect(mockNavigate).toHaveBeenCalledWith('/blogs/view/1');
  });
});
