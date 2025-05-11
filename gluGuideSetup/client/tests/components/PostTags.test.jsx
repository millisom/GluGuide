import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostTags from '../../src/components/PostTags';

// Mock CSS module
vi.mock('../../src/styles/ViewBlogEntries.module.css', () => ({
  default: {
    tagsContainer: 'tagsContainer',
    tagItem: 'tagItem',
    selectedTagInCard: 'selectedTagInCard'
  }
}), { virtual: true });

describe('PostTags Component', () => {
  const mockProps = {
    tags: ['react', 'javascript', 'node'],
    selectedTags: ['react'],
    setSelectedTags: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
  
  it('applies selected class to tags that are in the selectedTags array', () => {
    const { container } = render(<PostTags {...mockProps} />);
    
    // Find all tag buttons
    const tagButtons = container.querySelectorAll('button');
    
    // First tag should have the selected class
    expect(tagButtons[0].className).toContain('selectedTagInCard');
    
    // Other tags should not have the selected class
    expect(tagButtons[1].className).not.toContain('selectedTagInCard');
    expect(tagButtons[2].className).not.toContain('selectedTagInCard');
  });
  
  it('handles empty tags array', () => {
    const emptyProps = {
      ...mockProps,
      tags: []
    };
    
    const { container } = render(<PostTags {...emptyProps} />);
    
    // Should render the container but have no tag buttons
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button').length).toBe(0);
  });
  
  it('handles multiple selected tags', () => {
    const multipleSelectedProps = {
      ...mockProps,
      selectedTags: ['react', 'javascript']
    };
    
    const { container } = render(<PostTags {...multipleSelectedProps} />);
    
    // Find all tag buttons
    const tagButtons = container.querySelectorAll('button');
    
    // First two tags should have the selected class
    expect(tagButtons[0].className).toContain('selectedTagInCard');
    expect(tagButtons[1].className).toContain('selectedTagInCard');
    
    // Third tag should not have the selected class
    expect(tagButtons[2].className).not.toContain('selectedTagInCard');
  });
  
  it('handles clicking on the last unselected tag', () => {
    const almostAllSelectedProps = {
      ...mockProps,
      selectedTags: ['react', 'javascript']
    };
    
    render(<PostTags {...almostAllSelectedProps} />);
    
    // Click on the last unselected tag
    fireEvent.click(screen.getByText('node'));
    
    // Should add the tag to the selected tags
    expect(almostAllSelectedProps.setSelectedTags).toHaveBeenCalledWith(
      ['react', 'javascript', 'node']
    );
  });
  
  it('correctly handles undefined tags array', () => {
    const propsWithUndefinedTags = {
      ...mockProps,
      tags: undefined,
      selectedTags: []
    };
    
    const { container } = render(<PostTags {...propsWithUndefinedTags} />);
    
    // Should render the container but have no tag buttons
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button').length).toBe(0);
  });
  
  it('correctly handles non-array tags input', () => {
    // @ts-ignore Intentionally passing wrong type for testing
    const propsWithInvalidTags = {
      ...mockProps,
      tags: 'not-an-array',
      selectedTags: []
    };
    
    const { container } = render(<PostTags {...propsWithInvalidTags} />);
    
    // Should render the container but have no tag buttons
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button').length).toBe(0);
  });
  
  it('correctly handles undefined selectedTags array', () => {
    const propsWithUndefinedSelected = {
      ...mockProps,
      selectedTags: undefined
    };
    
    const { container } = render(<PostTags {...propsWithUndefinedSelected} />);
    
    // All tag buttons should render without the selected class
    const tagButtons = container.querySelectorAll('button');
    expect(tagButtons.length).toBe(3);
    
    Array.from(tagButtons).forEach(button => {
      expect(button.className).not.toContain('selectedTagInCard');
    });
  });
  
  it('uses correct CSS classes from the module', () => {
    const { container } = render(<PostTags {...mockProps} />);
    
    // Container should have the tagsContainer class
    expect(container.firstChild).toHaveClass('tagsContainer');
    
    // Buttons should have the tagItem class
    const buttons = container.querySelectorAll('button');
    Array.from(buttons).forEach(button => {
      expect(button).toHaveClass('tagItem');
    });
    
    // Selected button should also have the selectedTagInCard class
    expect(buttons[0]).toHaveClass('selectedTagInCard');
  });
}); 