import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PostCard from '../../src/components/PostCard';

// Mock PostTags component
vi.mock('../../src/components/PostTags', () => ({
  default: ({ tags }) => <div data-testid="post-tags">{tags.join(',')}</div>
}));

// Mock FontAwesomeIcon
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => <span data-testid={`icon-${icon.iconName}`}></span>
}));

describe('PostCard Component', () => {
  const mockPost = {
    id: 123,
    title: 'Test Post',
    username: 'testuser',
    created_at: '2025-05-01T12:00:00Z',
    likes: [1, 2, 3],
    likes_count: 3,
    tags: ['react', 'testing'],
    post_picture: 'test-image.jpg'
  };

  const mockProps = {
    post: mockPost,
    isAdmin: false,
    handleViewClick: vi.fn(),
    handleAdminDelete: vi.fn(),
    selectedTags: [],
    setSelectedTags: vi.fn()
  };

  it('renders post information correctly', () => {
    render(<PostCard {...mockProps} />);
    
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Author: testuser')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Likes count
    expect(screen.getByTestId('icon-heart')).toBeInTheDocument();
    expect(screen.getByTestId('post-tags')).toBeInTheDocument();
    expect(screen.getByAltText('Test Post')).toBeInTheDocument(); // Image
  });

  it('calls handleViewClick when clicking the post', () => {
    render(<PostCard {...mockProps} />);
    
    fireEvent.click(screen.getByText('Test Post').closest('div'));
    
    expect(mockProps.handleViewClick).toHaveBeenCalledWith(123);
  });

  it('renders admin actions when isAdmin is true', () => {
    render(<PostCard {...mockProps} isAdmin={true} />);
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls handleAdminDelete when delete button is clicked', () => {
    render(<PostCard {...mockProps} isAdmin={true} />);
    
    fireEvent.click(screen.getByText('Delete'));
    
    expect(mockProps.handleAdminDelete).toHaveBeenCalledWith(123);
  });
}); 