import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PostTags from '../../src/components/PostTags';

describe('PostTags Component', () => {
  const mockProps = {
    tags: ['react', 'javascript', 'node'],
    selectedTags: ['react'],
    setSelectedTags: vi.fn()
  };

  it('renders all tags properly', () => {
    render(<PostTags {...mockProps} />);
    
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('node')).toBeInTheDocument();
  });

  it('calls setSelectedTags when clicking an unselected tag', () => {
    render(<PostTags {...mockProps} />);
    
    // Click on an unselected tag
    fireEvent.click(screen.getByText('javascript'));
    
    // Should add the tag to the selected tags
    expect(mockProps.setSelectedTags).toHaveBeenCalledWith(['react', 'javascript']);
  });

  it('does not call setSelectedTags when clicking an already selected tag', () => {
    render(<PostTags {...mockProps} />);
    
    // Click on an already selected tag
    fireEvent.click(screen.getByText('react'));
    
    // Should not call setSelectedTags
    expect(mockProps.setSelectedTags).not.toHaveBeenCalled();
  });

  it('stops event propagation when clicking a tag', () => {
    render(<PostTags {...mockProps} />);
    
    const mockStopPropagation = vi.fn();
    const tagElement = screen.getByText('javascript');
    
    // Simulate click with stopPropagation tracking
    fireEvent.click(tagElement, {
      stopPropagation: mockStopPropagation
    });
    
    expect(mockStopPropagation).toHaveBeenCalled();
  });
}); 