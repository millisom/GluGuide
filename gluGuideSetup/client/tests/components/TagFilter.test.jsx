import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TagFilter from '../../src/components/TagFilter';

// Mock FontAwesomeIcon to avoid SVG rendering issues in tests
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="mock-icon" />
}));

describe('TagFilter Component', () => {
  const mockProps = {
    tagOptions: [
      { value: 'react', label: 'react' },
      { value: 'javascript', label: 'javascript' }
    ],
    selectedTags: ['react'],
    selectedTagValues: [{ value: 'react', label: 'react' }],
    handleTagMultiSelectChange: vi.fn(),
    handleTagRemove: vi.fn(),
    clearAllTags: vi.fn()
  };

  it('renders correctly with selected tags', () => {
    render(<TagFilter {...mockProps} />);
    
    // Check if the selected tag is displayed
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('Clear All Tags')).toBeInTheDocument();
  });

  it('calls clearAllTags when clear button is clicked', () => {
    render(<TagFilter {...mockProps} />);
    
    const clearButton = screen.getByText('Clear All Tags');
    fireEvent.click(clearButton);
    
    expect(mockProps.clearAllTags).toHaveBeenCalledTimes(1);
  });

  it('calls handleTagRemove when tag remove button is clicked', () => {
    render(<TagFilter {...mockProps} />);
    
    // Find tag remove button (it contains the icon)
    const removeButton = screen.getByTestId('mock-icon').closest('button');
    fireEvent.click(removeButton);
    
    expect(mockProps.handleTagRemove).toHaveBeenCalledWith('react');
  });
}); 