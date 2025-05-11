const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getAllTags,
  getAuthorProfile,
  getUserPost
} = require('../../controllers/postController');
const db = require('../../config/db');
const postHelpers = require('../../helpers/postHelpers');
const Profile = require('../../models/profileModel');
const Post = require('../../models/postModel');

// Mock dependencies
jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

jest.mock('../../models/postModel', () => ({
  getAllPostsOrderedByTime: jest.fn(),
  getPostById: jest.fn(),
  deletePostById: jest.fn(),
  updateLikes: jest.fn(),
  getAllTags: jest.fn(),
  getAuthorProfileByUsername: jest.fn(),
  getPosts: jest.fn()
}));

jest.mock('../../models/profileModel', () => ({
  getUserByName: jest.fn()
}));

jest.mock('../../helpers/postHelpers', () => ({
  formatPostData: jest.fn(post => post),
  validatePostData: jest.fn(() => ({ valid: true })),
  parseTagsFromRequest: jest.fn(tags => Array.isArray(tags) ? tags : []),
  deleteImageFile: jest.fn(),
  getImagePath: jest.fn()
}));

// Mock multer
jest.mock('../../config/multerConfig', () => ({
  single: jest.fn(() => (req, res, next) => {
    req.file = { filename: 'test-image.jpg' };
    next();
  })
}));

describe('Post Controller', () => {
  let mockReq;
  let mockRes;
  
  beforeEach(() => {
    mockReq = {
      params: { id: '1' },
      body: {
        title: 'Test Post',
        content: 'Test content',
        tags: ['test', 'mock']
      },
      session: {
        userId: 123,
        username: 'testuser'
      }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  describe('getAllPosts', () => {
    it('should return all posts on success', async () => {
      const mockPosts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
      Post.getAllPostsOrderedByTime.mockResolvedValue(mockPosts);
      
      await getAllPosts(mockReq, mockRes);
      
      expect(Post.getAllPostsOrderedByTime).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
    });
    
    it('should handle errors', async () => {
      Post.getAllPostsOrderedByTime.mockRejectedValue(new Error('Database error'));
      
      await getAllPosts(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    });
    
    it('should return 404 if no posts found', async () => {
      Post.getAllPostsOrderedByTime.mockResolvedValue([]);
      
      await getAllPosts(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'No posts found' }));
    });
  });
  
  describe('getPostById', () => {
    it('should return a post by id on success', async () => {
      const mockPost = { id: 1, title: 'Post 1' };
      Post.getPostById.mockResolvedValue(mockPost);
      
      await getPostById(mockReq, mockRes);
      
      expect(Post.getPostById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPost);
    });
    
    it('should return 404 if post not found', async () => {
      Post.getPostById.mockResolvedValue(null);
      
      await getPostById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Post not found' }));
    });
    
    it('should handle invalid post ID', async () => {
      mockReq.params.id = 'invalid';
      
      await getPostById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid post ID' }));
    });
    
    it('should handle server errors', async () => {
      Post.getPostById.mockRejectedValue(new Error('Database error'));
      
      await getPostById(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });
  });
  
  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      Post.deletePostById.mockResolvedValue(true);
      
      await deletePost(mockReq, mockRes);
      
      expect(Post.deletePostById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
    });
    
    it('should return 404 if post not found for deletion', async () => {
      Post.deletePostById.mockResolvedValue(false);
      
      await deletePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });
    
    it('should handle errors during deletion', async () => {
      Post.deletePostById.mockRejectedValue(new Error('Database error'));
      
      await deletePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Internal Server Error' }));
    });
  });
  
  describe('toggleLike', () => {
    it('should toggle like on a post', async () => {
      const mockPost = { id: 1, likes: [456] };
      Post.getPostById.mockResolvedValue(mockPost);
      Post.updateLikes.mockResolvedValue(true);
      
      await toggleLike(mockReq, mockRes);
      
      // Should add the user's ID to likes
      expect(Post.updateLikes).toHaveBeenCalledWith('1', [456, 123]);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, likesCount: 2 });
    });
    
    it('should toggle unlike on a post', async () => {
      const mockPost = { id: 1, likes: [123, 456] };
      Post.getPostById.mockResolvedValue(mockPost);
      Post.updateLikes.mockResolvedValue(true);
      
      await toggleLike(mockReq, mockRes);
      
      // Should remove the user's ID from likes
      expect(Post.updateLikes).toHaveBeenCalledWith('1', [456]);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ success: true, likesCount: 1 });
    });
    
    it('should handle missing user ID', async () => {
      mockReq.session.userId = null;
      
      await toggleLike(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should handle post not found', async () => {
      Post.getPostById.mockResolvedValue(null);
      
      await toggleLike(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
    
    it('should handle errors', async () => {
      Post.getPostById.mockRejectedValue(new Error('Database error'));
      
      await toggleLike(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('getAllTags', () => {
    it('should return all tags successfully', async () => {
      const mockTags = ['react', 'javascript', 'node'];
      Post.getAllTags.mockResolvedValue(mockTags);
      
      await getAllTags(mockReq, mockRes);
      
      expect(Post.getAllTags).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockTags);
    });
    
    it('should handle errors', async () => {
      Post.getAllTags.mockRejectedValue(new Error('Database error'));
      
      await getAllTags(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
    });
  });
  
  describe('getAuthorProfile', () => {
    it('should return author profile successfully', async () => {
      mockReq.params.username = 'testuser';
      const mockProfile = { id: 123, username: 'testuser', email: 'test@example.com' };
      Post.getAuthorProfileByUsername.mockResolvedValue(mockProfile);
      
      await getAuthorProfile(mockReq, mockRes);
      
      expect(Post.getAuthorProfileByUsername).toHaveBeenCalledWith('testuser');
      expect(mockRes.json).toHaveBeenCalledWith(mockProfile);
    });
    
    it('should return 404 if author not found', async () => {
      mockReq.params.username = 'nonexistent';
      Post.getAuthorProfileByUsername.mockResolvedValue(null);
      
      await getAuthorProfile(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Author not found' });
    });
    
    it('should handle errors', async () => {
      mockReq.params.username = 'testuser';
      Post.getAuthorProfileByUsername.mockRejectedValue(new Error('Database error'));
      
      await getAuthorProfile(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('getUserPost', () => {
    it('should return user posts successfully', async () => {
      const mockUser = [{ id: 123, username: 'testuser' }];
      const mockPosts = [{ id: 1, title: 'User Post' }];
      
      Profile.getUserByName.mockResolvedValue(mockUser);
      Post.getPosts.mockResolvedValue(mockPosts);
      
      await getUserPost(mockReq, mockRes);
      
      expect(Profile.getUserByName).toHaveBeenCalledWith('testuser');
      expect(Post.getPosts).toHaveBeenCalledWith(123);
      expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
    });
    
    it('should handle unauthorized access', async () => {
      mockReq.session.username = null;
      
      await getUserPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should return 404 if user not found', async () => {
      Profile.getUserByName.mockResolvedValue([]);
      
      await getUserPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
    
    it('should handle errors', async () => {
      Profile.getUserByName.mockRejectedValue(new Error('Database error'));
      
      await getUserPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
}); 