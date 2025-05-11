import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TagFilter from '../../src/components/TagFilter';

// Mock the react-select component
vi.mock('react-select', () => ({
  default: ({ onChange, value, options, placeholder }) => (
    <div data-testid="mock-select">
      <div data-testid="current-value">
        {JSON.stringify(value)}
      </div>
      <input 
        data-testid="select-input" 
        placeholder={placeholder} 
        onChange={(e) => {
          // Find option that matches input value
          const selectedOption = options.find(
            opt => opt.label.toLowerCase().includes(e.target.value.toLowerCase())
          );
          if (selectedOption) {
            onChange([selectedOption]);
          }
        }} 
      />
      <div data-testid="options-list">
        {options.map(option => (
          <div 
            key={option.value} 
            data-testid={`option-${option.value}`}
            onClick={() => onChange([option])}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}));

// Mock FontAwesomeIcon to avoid SVG rendering issues in tests
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="mock-icon" />
}));

// Mock CSS module
vi.mock('../../src/styles/ViewBlogEntries.module.css', () => ({
  default: {
    tagFilterSection: 'tagFilterSection',
    filterTitle: 'filterTitle',
    tagSelectDropdown: 'tagSelectDropdown',
    selectedTagsList: 'selectedTagsList',
    selectedTagsTitle: 'selectedTagsTitle',
    selectedTagItem: 'selectedTagItem',
    removeTagButton: 'removeTagButton',
    clearAllButton: 'clearAllButton',
  }
}), { virtual: true });

describe('TagFilter Component', () => {
  const mockProps = {
    tagOptions: [
      { value: 'react', label: 'react' },
      { value: 'javascript', label: 'javascript' },
      { value: 'css', label: 'css' }
    ],
    selectedTags: ['react'],
    selectedTagValues: [{ value: 'react', label: 'react' }],
    handleTagMultiSelectChange: vi.fn(),
    handleTagRemove: vi.fn(),
    clearAllTags: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with selected tags', () => {
    render(<TagFilter {...mockProps} />);
    
    // Check if the selected tag is displayed
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('Clear All Tags')).toBeInTheDocument();
    expect(screen.getByText('Active Filters:')).toBeInTheDocument();
    
    // Check if the select component is rendered
    expect(screen.getByTestId('mock-select')).toBeInTheDocument();
    
    // Check if current value is displayed correctly
    const currentValue = screen.getByTestId('current-value');
    expect(currentValue.textContent).toContain('react');
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
  
  it('calls handleTagMultiSelectChange when a new option is selected', () => {
    render(<TagFilter {...mockProps} />);
    
    // Find the option for CSS and click it
    const cssOption = screen.getByTestId('option-css');
    fireEvent.click(cssOption);
    
    // Should call handleTagMultiSelectChange with the CSS option
    expect(mockProps.handleTagMultiSelectChange).toHaveBeenCalledWith(
      [{ value: 'css', label: 'css' }]
    );
  });
  
  it('displays no selected tags section when no tags are selected', () => {
    const propsWithNoTags = {
      ...mockProps,
      selectedTags: [],
      selectedTagValues: []
    };
    
    render(<TagFilter {...propsWithNoTags} />);
    
    // The selected tags section should not be displayed
    expect(screen.queryByText('Active Filters:')).not.toBeInTheDocument();
    expect(screen.queryByText('Clear All Tags')).not.toBeInTheDocument();
  });
  
  it('correctly displays multiple selected tags', () => {
    const propsWithMultipleTags = {
      ...mockProps,
      selectedTags: ['react', 'javascript'],
      selectedTagValues: [
        { value: 'react', label: 'react' },
        { value: 'javascript', label: 'javascript' }
      ]
    };
    
    render(<TagFilter {...propsWithMultipleTags} />);
    
    // Both tags should be displayed
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    
    // There should be two remove buttons
    expect(screen.getAllByTestId('mock-icon').length).toBe(2);
  });
  
  it('filters options when typing in the select input', () => {
    render(<TagFilter {...mockProps} />);
    
    // Find the select input
    const selectInput = screen.getByTestId('select-input');
    
    // Type 'javascript' to filter options
    fireEvent.change(selectInput, { target: { value: 'javascript' } });
    
    // Should call handleTagMultiSelectChange with the javascript option
    expect(mockProps.handleTagMultiSelectChange).toHaveBeenCalledWith(
      [{ value: 'javascript', label: 'javascript' }]
    );
  });
}); 