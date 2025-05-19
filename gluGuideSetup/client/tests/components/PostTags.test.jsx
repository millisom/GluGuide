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
  const defaultTags = ['react', 'javascript', 'node'];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all tags properly', () => {
    render(<PostTags tags={defaultTags} selectedTags={['react']} setSelectedTags={vi.fn()} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByText('node')).toBeInTheDocument();
  });

  it('calls setSelectedTags when clicking an unselected tag', () => {
    const setSelectedTags = vi.fn();
    render(<PostTags tags={defaultTags} selectedTags={['react']} setSelectedTags={setSelectedTags} />);
    fireEvent.click(screen.getByText('javascript'));
    expect(setSelectedTags).toHaveBeenCalledWith(['react', 'javascript']);
  });

  it('does not call setSelectedTags when clicking a selected tag', () => {
    const setSelectedTags = vi.fn();
    render(<PostTags tags={defaultTags} selectedTags={['react']} setSelectedTags={setSelectedTags} />);
    fireEvent.click(screen.getByText('react'));
    expect(setSelectedTags).not.toHaveBeenCalled();
  });

  it('stops event propagation when clicking a tag', () => {
    const stopPropagation = vi.fn();
    const setSelectedTags = vi.fn();
  
    render(<PostTags tags={defaultTags} selectedTags={[]} setSelectedTags={setSelectedTags} />);
  
    const tagButton = screen.getByText('javascript');
  
    // Create real event
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  
    // Patch in spy
    Object.defineProperty(event, 'stopPropagation', {
      value: stopPropagation,
      writable: true
    });
  
    tagButton.dispatchEvent(event);
  
    expect(stopPropagation).toHaveBeenCalled();
  });
  
  
  

  it('applies selected class to selected tags only', () => {
    const { container } = render(<PostTags tags={defaultTags} selectedTags={['react']} setSelectedTags={vi.fn()} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons[0].className).toContain('selectedTagInCard'); // react
    expect(buttons[1].className).not.toContain('selectedTagInCard'); // javascript
    expect(buttons[2].className).not.toContain('selectedTagInCard'); // node
  });

  it('renders no tags if tags array is empty', () => {
    const { container } = render(<PostTags tags={[]} selectedTags={[]} setSelectedTags={vi.fn()} />);
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('handles multiple selected tags correctly', () => {
    const { container } = render(<PostTags tags={defaultTags} selectedTags={['react', 'javascript']} setSelectedTags={vi.fn()} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons[0]).toHaveClass('selectedTagInCard');
    expect(buttons[1]).toHaveClass('selectedTagInCard');
    expect(buttons[2]).not.toHaveClass('selectedTagInCard');
  });

  it('adds the last unselected tag correctly', () => {
    const setSelectedTags = vi.fn();
    render(<PostTags tags={defaultTags} selectedTags={['react', 'javascript']} setSelectedTags={setSelectedTags} />);
    fireEvent.click(screen.getByText('node'));
    expect(setSelectedTags).toHaveBeenCalledWith(['react', 'javascript', 'node']);
  });

  it('handles undefined tags array gracefully', () => {
    const { container } = render(<PostTags tags={undefined} selectedTags={[]} setSelectedTags={vi.fn()} />);
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('handles non-array tags input without crashing', () => {
    const { container } = render(<PostTags tags={'not-an-array'} selectedTags={[]} setSelectedTags={vi.fn()} />);
    expect(container.querySelector('.tagsContainer')).toBeInTheDocument();
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('renders correctly if selectedTags is undefined', () => {
    const { container } = render(<PostTags tags={defaultTags} selectedTags={undefined} setSelectedTags={vi.fn()} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
    buttons.forEach(btn => {
      expect(btn.className).not.toContain('selectedTagInCard');
    });
  });

  it('applies correct CSS classes to the container and tags', () => {
    const { container } = render(<PostTags tags={defaultTags} selectedTags={['react']} setSelectedTags={vi.fn()} />);
    expect(container.firstChild).toHaveClass('tagsContainer');
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => expect(btn).toHaveClass('tagItem'));
    expect(buttons[0]).toHaveClass('selectedTagInCard');
  });
});
