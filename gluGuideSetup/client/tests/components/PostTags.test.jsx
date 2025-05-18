import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostTags from '../../src/components/PostTags';

// ✅ Mock CSS module with virtual true
vi.mock('../../src/styles/ViewBlogEntries.module.css', () => ({
  default: {
    tagsContainer: 'tagsContainer',
    tagItem: 'tagItem',
    selectedTagInCard: 'selectedTagInCard',
  }
}), { virtual: true });

describe('PostTags Component', () => {
  const baseProps = {
    tags: ['react', 'javascript', 'node'],
    selectedTags: ['react'],
    setSelectedTags: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all tags properly', () => {
    render(<PostTags {...baseProps} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('node')).toBeInTheDocument();
  });

  it('calls setSelectedTags when clicking an unselected tag', () => {
    render(<PostTags {...baseProps} />);
    fireEvent.click(screen.getByText('javascript'));
    expect(baseProps.setSelectedTags).toHaveBeenCalledWith(['react', 'javascript']);
  });

  it('does not call setSelectedTags when clicking a selected tag', () => {
    render(<PostTags {...baseProps} />);
    fireEvent.click(screen.getByText('react'));
    expect(baseProps.setSelectedTags).not.toHaveBeenCalled();
  });

  it('stops event propagation when clicking a tag', () => {
    render(<PostTags {...baseProps} />);
    const tag = screen.getByText('javascript');
    const mockEvent = { stopPropagation: vi.fn() };
    fireEvent.click(tag, mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('applies selected class to selected tags only', () => {
    const { container } = render(<PostTags {...baseProps} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].className).toContain('selectedTagInCard'); // react
    expect(buttons[1].className).not.toContain('selectedTagInCard'); // javascript
    expect(buttons[2].className).not.toContain('selectedTagInCard'); // node
  });

  it('renders no tags if tags array is empty', () => {
    const props = { ...baseProps, tags: [] };
    const { container } = render(<PostTags {...props} />);
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('handles multiple selected tags correctly', () => {
    const props = { ...baseProps, selectedTags: ['react', 'javascript'] };
    const { container } = render(<PostTags {...props} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons[0]).toHaveClass('selectedTagInCard'); // react
    expect(buttons[1]).toHaveClass('selectedTagInCard'); // javascript
    expect(buttons[2]).not.toHaveClass('selectedTagInCard'); // node
  });

  it('adds the last unselected tag correctly', () => {
    const props = { ...baseProps, selectedTags: ['react', 'javascript'] };
    render(<PostTags {...props} />);
    fireEvent.click(screen.getByText('node'));
    expect(props.setSelectedTags).toHaveBeenCalledWith(['react', 'javascript', 'node']);
  });

  it('handles undefined tags array gracefully', () => {
    const props = { ...baseProps, tags: undefined, selectedTags: [] };
    const { container } = render(<PostTags {...props} />);
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('handles non-array tags input without crashing', () => {
    const props = { ...baseProps, tags: 'not-an-array', selectedTags: [] };
    const { container } = render(<PostTags {...props} />);
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('renders correctly if selectedTags is undefined', () => {
    const props = { ...baseProps, selectedTags: undefined };
    const { container } = render(<PostTags {...props} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
    buttons.forEach(btn => {
      expect(btn.className).not.toContain('selectedTagInCard');
    });
  });

  it('applies correct CSS classes to the container and tags', () => {
    const { container } = render(<PostTags {...baseProps} />);
    expect(container.firstChild).toHaveClass('tagsContainer');
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => expect(btn).toHaveClass('tagItem'));
    expect(buttons[0]).toHaveClass('selectedTagInCard');
  });
});
