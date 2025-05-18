import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TagFilter from '../../src/components/TagFilter';

// ✅ Mock the react-select component using JSX
vi.mock('react-select', () => ({
  default: ({ onChange, value = [], options = [], placeholder, isMulti, classNamePrefix }) => (
    <div data-testid="mock-select" className={classNamePrefix ? `${classNamePrefix}-container` : ''}>
      <div data-testid="current-value">
        {JSON.stringify(value)}
      </div>
      <input
        data-testid="select-input"
        placeholder={placeholder}
        aria-multiselectable={isMulti ? 'true' : 'false'}
        onChange={(e) => {
          const selectedOption = options.find(opt =>
            opt.label.toLowerCase().includes(e.target.value.toLowerCase())
          );
          if (selectedOption) {
            onChange(isMulti ? [selectedOption] : selectedOption);
          }
        }}
      />
      <div data-testid="options-list">
        {options.map(option => (
          <div
            key={option.value}
            data-testid={`option-${option.value}`}
            onClick={() => onChange(isMulti ? [option] : option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}));

// ✅ Mock FontAwesomeIcon to avoid DOM/SVG issues
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, size }) => {
    const name = typeof icon === 'object' && icon.iconName ? icon.iconName : 'unknown';
    return <span data-testid={`mock-icon-${name}`} data-size={size} />;
  }
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
  faTimes: { iconName: 'times' }
}));

// ✅ Mock CSS module
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
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('Clear All Tags')).toBeInTheDocument();
    expect(screen.getByText('Active Filters:')).toBeInTheDocument();
    expect(screen.getByTestId('mock-select')).toBeInTheDocument();
    expect(screen.getByTestId('current-value').textContent).toContain('react');
    expect(screen.getByText('Filter by Tags:')).toBeInTheDocument();
    expect(screen.getByTestId('select-input')).toHaveAttribute('placeholder', 'Select tags...');
    expect(screen.getByTestId('select-input')).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('calls clearAllTags when clear button is clicked', () => {
    render(<TagFilter {...mockProps} />);
    fireEvent.click(screen.getByText('Clear All Tags'));
    expect(mockProps.clearAllTags).toHaveBeenCalledTimes(1);
  });

  it('calls handleTagRemove when remove icon is clicked', () => {
    render(<TagFilter {...mockProps} />);
    const removeButton = screen.getByTestId('mock-icon-times').closest('button');
    fireEvent.click(removeButton);
    expect(mockProps.handleTagRemove).toHaveBeenCalledWith('react');
  });

  it('calls handleTagMultiSelectChange when selecting a new tag', () => {
    render(<TagFilter {...mockProps} />);
    fireEvent.click(screen.getByTestId('option-css'));
    expect(mockProps.handleTagMultiSelectChange).toHaveBeenCalledWith([{ value: 'css', label: 'css' }]);
  });

  it('does not render selected section if no tags are selected', () => {
    render(<TagFilter {...mockProps} selectedTags={[]} selectedTagValues={[]} />);
    expect(screen.queryByText('Active Filters:')).not.toBeInTheDocument();
    expect(screen.queryByText('Clear All Tags')).not.toBeInTheDocument();
  });

  it('renders multiple selected tags and remove buttons', () => {
    render(<TagFilter {...mockProps} selectedTags={['react', 'javascript']} selectedTagValues={[
      { value: 'react', label: 'react' },
      { value: 'javascript', label: 'javascript' }
    ]} />);
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-icon-times')).toHaveLength(2);
  });

  it('filters tag options by typing', () => {
    render(<TagFilter {...mockProps} />);
    fireEvent.change(screen.getByTestId('select-input'), { target: { value: 'javascript' } });
    expect(mockProps.handleTagMultiSelectChange).toHaveBeenCalledWith([{ value: 'javascript', label: 'javascript' }]);
  });

  it('renders without crashing when tagOptions is empty', () => {
    render(<TagFilter {...mockProps} tagOptions={[]} selectedTags={[]} selectedTagValues={[]} />);
    expect(screen.getByText('Filter by Tags:')).toBeInTheDocument();
    expect(screen.getByTestId('mock-select')).toBeInTheDocument();
  });

  it('renders FontAwesome icon with correct props', () => {
    render(<TagFilter {...mockProps} />);
    expect(screen.getByTestId('mock-icon-times')).toHaveAttribute('data-size', 'xs');
  });
});
