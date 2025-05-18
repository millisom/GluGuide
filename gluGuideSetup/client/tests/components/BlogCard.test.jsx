import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BlogCard from '../../src/components/BlogCard';
import axiosConfig from '../../src/api/axiosConfig';

// Mock axios
vi.mock('../../src/api/axiosConfig', () => ({
  default: {
    delete: vi.fn().mockResolvedValue({ data: { message: 'Post deleted successfully' } })
  }
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock html-react-parser
vi.mock('html-react-parser', () => ({
  default: (content) => content || '',
}));

// Mock FontAwesome
vi.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: function MockFontAwesomeIcon({ icon }) {
    const iconName = icon?.iconName || 'unknown';
    return {
      type: 'span',
      props: {
        'data-testid': `icon-${iconName}`
      }
    };
  }
}));

vi.mock('@fortawesome/free-solid-svg-icons', () => ({
  faTrash: { iconName: 'trash' },
  faEdit: { iconName: 'pen-to-square' },
  faHeart: { iconName: 'heart' }
}));

// Mock CSS modules
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
}));

describe('BlogCard Component', () => {
  const originalConfirm = window.confirm;
  const originalReload = window.location.reload;
  const originalAlert = window.alert;

  const mockBlog = {
    id: 1,
    title: 'Test Blog',
    content: 'This is a test blog content',
    likes_count: 5,
    tags: ['react', 'javascript'],
  };

  const mockLongBlog = {
    id: 2,
    title: 'Long Blog',
    content: 'A'.repeat(200) + ' long content that should be truncated',
    likes_count: 1,
    tags: ['react'],
  };

  const mockBlogWithLikesArray = {
    id: 3,
    title: 'Blog with likes array',
    content: 'Test content',
    likes: [1, 2, 3],
    tags: ['node'],
  };

  const mockBlogWithoutTags = {
    id: 4,
    title: 'Blog without tags',
    content: 'Test content',
    likes_count: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn().mockReturnValue(true);
    window.location.reload = vi.fn();
    window.alert = vi.fn();
  });

  afterEach(() => {
    window.confirm = originalConfirm;
    window.location.reload = originalReload;
    window.alert = originalAlert;
  });

  it('renders blog information correctly', () => {
    const { container } = render(<BlogCard blog={mockBlog} />);
    expect(container.textContent).toContain('Test Blog');
    expect(container.textContent).toContain('This is a test blog content');
    expect(container.textContent).toContain('5 Likes');
  });

  it('renders blog with long content and truncates', () => {
    render(<BlogCard blog={mockLongBlog} />);
    expect(screen.getByText('Long Blog')).toBeInTheDocument();
    expect(screen.getByText(/Likes/i)).toBeInTheDocument();
  });

  it('renders blog using likes array instead of likes_count', () => {
    render(<BlogCard blog={mockBlogWithLikesArray} />);
    expect(screen.getByText('Blog with likes array')).toBeInTheDocument();
    expect(screen.getByText('3 Likes')).toBeInTheDocument();
  });

  it('renders blog with no tags without crashing', () => {
    render(<BlogCard blog={mockBlogWithoutTags} />);
    expect(screen.getByText('Blog without tags')).toBeInTheDocument();
  });

  it('shows "Like" (singular) when likes_count is 1', () => {
    render(<BlogCard blog={mockLongBlog} />);
    expect(screen.getByText('1 Like')).toBeInTheDocument();
  });

  it('navigates to the blog view page when title is clicked', () => {
    render(<BlogCard blog={mockBlog} />);
    fireEvent.click(screen.getByText('Test Blog'));
    expect(mockNavigate).toHaveBeenCalledWith('/blogs/view/1');
  });

  it('navigates to edit page when edit button is clicked', () => {
    render(<BlogCard blog={mockBlog} />);
    const editBtn = screen.getByTestId('icon-pen-to-square').closest('button');
    fireEvent.click(editBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/blogs/edit/1');
  });

  it('deletes post after confirm', async () => {
    const axios = axiosConfig;
    render(<BlogCard blog={mockBlog} />);
    const deleteBtn = screen.getByTestId('icon-trash').closest('button');
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalledWith(`/admin/posts/${mockBlog.id}`, { withCredentials: true });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Post deleted successfully.');
    });
  });
});
