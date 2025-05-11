import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BlogCard from '../../src/components/BlogCard';
import axios from '../../src/api/axiosConfig';

// Mock dependencies
vi.mock('../../src/api/axiosConfig');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));
vi.mock('html-react-parser', () => ({
  default: (content) => content,
}));
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon }) => {
    // Use the iconName from the icon object
    const iconName = icon.iconName || 'unknown';
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

describe('BlogCard Component', () => {
  const mockBlog = {
    id: 1,
    title: 'Test Blog',
    content: 'This is a test blog content',
    likes_count: 5,
    tags: ['react', 'javascript'],
  };

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
}); 