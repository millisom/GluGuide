import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BlogCard from '../../src/components/BlogCard';
import axios from '../../src/api/axiosConfig';

// Mock dependencies
vi.mock('../../src/api/axiosConfig');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));
vi.mock('html-react-parser', () => ({
  default: (content) => content,
}));
vi.mock('@fortawesome/react-fontawesome', () => ({
  // eslint-disable-next-line react/prop-types
  FontAwesomeIcon: (props) => {
    // eslint-disable-next-line react/prop-types
    const iconName = props.icon?.iconName || 'unknown';
    return <span data-testid={`icon-${iconName}`}></span>;
  },
}));
vi.mock('@fortawesome/free-solid-svg-icons', () => ({
  faTrash: { iconName: 'trash' },
  faEdit: { iconName: 'pen-to-square' },
  faHeart: { iconName: 'heart' }
}));
vi.mock('../../src/styles/Blogcard.module.css', () => ({
  default: {
    card: 'card',
    cardContent: 'cardContent',
    cardTitle: 'cardTitle',
    cardDescription: 'cardDescription',
    tagsContainer: 'tagsContainer',
    tagItem: 'tagItem',
    cardFooter: 'cardFooter',
    postLikes: 'postLikes',
    heart: 'heart',
    iconContainer: 'iconContainer',
    iconButton: 'iconButton',
  }
}), { virtual: true });

// Store original window methods
const originalConfirm = window.confirm;
const originalReload = window.location.reload;
const originalAlert = window.alert;

describe('BlogCard Component', () => {
  const mockBlog = {
    id: 1,
    title: 'Test Blog',
    content: 'This is a test blog content',
    likes_count: 5,
    tags: ['react', 'javascript'],
  };
  
  const mockLongBlog = {
    id: 2,
    title: 'Long Blog',
    content: 'A'.repeat(200) + ' long content that should be truncated',
    likes_count: 1,
    tags: ['react'],
  };
  
  const mockBlogWithLikesArray = {
    id: 3,
    title: 'Blog with likes array',
    content: 'Test content',
    likes: [1, 2, 3],
    tags: ['node'],
  };
  
  const mockBlogWithoutTags = {
    id: 4,
    title: 'Blog without tags',
    content: 'Test content',
    likes_count: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn().mockReturnValue(true);
    window.location.reload = vi.fn();
    window.alert = vi.fn();
    axios.delete.mockResolvedValue({ data: { message: 'Post deleted successfully' } });
  });
  
  afterEach(() => {
    window.confirm = originalConfirm;
    window.location.reload = originalReload;
    window.alert = originalAlert;
  });

  it('renders blog information correctly', () => {
    render(<BlogCard blog={mockBlog} />);
    
    expect(screen.getByText('Test Blog')).toBeInTheDocument();
    expect(screen.getByText('This is a test blog content')).toBeInTheDocument();
    expect(screen.getByText('5 Likes')).toBeInTheDocument();
    
    // Check for tags
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    
    // Check for icons
    expect(screen.getByTestId('icon-pen-to-square')).toBeInTheDocument();
    expect(screen.getByTestId('icon-trash')).toBeInTheDocument();
    expect(screen.getByTestId('icon-heart')).toBeInTheDocument();
  });
  
  it('truncates long content properly', () => {
    render(<BlogCard blog={mockLongBlog} />);
    
    expect(screen.getByText(/^A+\.\.\.$/)).toBeInTheDocument();
    expect(screen.queryByText('long content that should be truncated')).not.toBeInTheDocument();
  });
  
  it('renders blog with likes array instead of likes_count', () => {
    render(<BlogCard blog={mockBlogWithLikesArray} />);
    
    expect(screen.getByText('3 Likes')).toBeInTheDocument();
  });
  
  it('renders blog without tags', () => {
    render(<BlogCard blog={mockBlogWithoutTags} />);
    
    expect(screen.getByText('Blog without tags')).toBeInTheDocument();
    expect(screen.getByText('0 Likes')).toBeInTheDocument();
    
    // No tags section should be rendered
    expect(screen.queryByTestId('tagsContainer')).not.toBeInTheDocument();
  });
  
  it('shows singular "Like" text when likes_count is 1', () => {
    render(<BlogCard blog={mockLongBlog} />);
    
    expect(screen.getByText('1 Like')).toBeInTheDocument();
  });
  
  it('navigates to the blog view page when clicking the title', () => {
    render(<BlogCard blog={mockBlog} />);
    
    fireEvent.click(screen.getByText('Test Blog'));
    expect(mockNavigate).toHaveBeenCalledWith('/blogs/view/1');
  });
  
  it('navigates to edit page when clicking edit button', () => {
    render(<BlogCard blog={mockBlog} />);
    
    const editButton = screen.getByTestId('icon-pen-to-square').closest('button');
    fireEvent.click(editButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/blogs/edit/1');
  });
  
  it('deletes post when clicking delete button and confirming', async () => {
    render(<BlogCard blog={mockBlog} />);
    
    const deleteButton = screen.getByTestId('icon-trash').closest('button');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    
    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:8080/deletePost/1',
      { withCredentials: true }
    );
    
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Post deleted successfully.');
    });
  });
  
  it('does not delete post when canceling the confirmation', () => {
    window.confirm.mockReturnValueOnce(false);
    render(<BlogCard blog={mockBlog} />);
    
    const deleteButton = screen.getByTestId('icon-trash').closest('button');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(axios.delete).not.toHaveBeenCalled();
  });
  
  it('handles delete error properly', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.delete.mockRejectedValueOnce(new Error('Network error'));
    
    render(<BlogCard blog={mockBlog} />);
    
    const deleteButton = screen.getByTestId('icon-trash').closest('button');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Failed to delete post.');
    });
    
    consoleSpy.mockRestore();
  });
  
  it('navigates to tag search when clicking a tag', () => {
    render(<BlogCard blog={mockBlog} />);
    
    const tagButton = screen.getByText('react');
    fireEvent.click(tagButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/blogs?tag=react');
  });
  
  it('stops event propagation when clicking a tag', () => {
    render(<BlogCard blog={mockBlog} />);
    
    const mockStopPropagation = vi.fn();
    const tagButton = screen.getByText('react');
    
    fireEvent.click(tagButton, {
      stopPropagation: mockStopPropagation,
    });
    
    expect(mockStopPropagation).toHaveBeenCalled();
  });
}); 