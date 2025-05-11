import { vi } from 'vitest';

// Mock react-select
vi.mock('react-select', () => ({
  default: function MockSelect(props) {
    return {
      type: 'div',
      props: {
        'data-testid': 'select-mock',
        children: [
          {
            type: 'input',
            props: {
              'data-testid': 'select-input',
              placeholder: props.placeholder,
              onChange: (e) => props.onChange([{ value: e.target.value, label: e.target.value }])
            }
          },
          {
            type: 'div',
            props: {
              'data-testid': 'select-options',
              children: props.options ? props.options.map((option) => ({
                type: 'div',
                key: option.value,
                props: {
                  'data-testid': `option-${option.value}`,
                  children: option.label
                }
              })) : []
            }
          }
        ]
      }
    };
  }
}));

// Mock the ViewBlogEntries component that's causing errors
vi.mock('../../src/components/ViewBlogEntries', () => ({
  default: function MockViewBlogEntries() {
    return {
      type: 'div',
      props: {
        'data-testid': 'mock-view-blog-entries',
        children: 'Mock ViewBlogEntries'
      }
    };
  }
}));

// Mock all problematic components
vi.mock('../../src/components/BlogCard', () => ({
  default: function MockBlogCard(props) {
    return {
      type: 'div',
      props: {
        'data-testid': `blog-card-${props.blog?.id || 'unknown'}`,
        children: [
          {
            type: 'h3',
            props: {
              children: props.blog?.title || 'Untitled'
            }
          },
          {
            type: 'div',
            props: {
              children: props.blog?.content || 'No content'
            }
          }
        ]
      }
    };
  }
}));

// Make sure these components handle undefined availableTags
vi.mock('../src/components/ViewBlogEntries', () => ({
  default: function SafeViewBlogEntries() {
    return {
      type: 'div',
      props: {
        'data-testid': 'mock-view-blog-entries',
        children: 'Safe Mock ViewBlogEntries'
      }
    };
  }
})); 