import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ViewBlogEntries from '../../src/components/ViewBlogEntries';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({
    search: '',
    pathname: '/blogs'
  })
}));

// Mock child components
vi.mock('../../src/components/TagFilter', () => ({
  default: ({ selectedTags, clearAllTags }) => (
    <div data-testid="tag-filter">
      {selectedTags.map(tag => (
        <span key={tag} data-testid={`tag-${tag}`}>{tag}</span>
      ))}
      <button data-testid="clear-tags" onClick={clearAllTags}>Clear Tags</button>
    </div>
  )
}));

vi.mock('../../src/components/PostCard', () => ({
  default: ({ post }) => (
    <div data-testid={`post-${post.id}`} className="post-card">
      <h3>{post.title}</h3>
      <p>By: {post.username}</p>
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
}); 