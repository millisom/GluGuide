const {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost
} = require('../../controllers/postController');
const db = require('../../config/db');
const postHelpers = require('../../helpers/postHelpers');

// Mock dependencies
jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

jest.mock('../../helpers/postHelpers', () => ({
  formatPostData: jest.fn(post => post),
  validatePostData: jest.fn(() => ({ valid: true }))
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
        userId: 123
      }
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  describe('getAllPosts', () => {
    it('should return all posts on success', async () => {
      const mockPosts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
      db.query.mockResolvedValue({ rows: mockPosts });
      
      await getAllPosts(mockReq, mockRes);
      
      expect(db.query).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
    });
    
    it('should handle errors', async () => {
      db.query.mockRejectedValue(new Error('Database error'));
      
      await getAllPosts(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error fetching posts' });
    });
  });
  
  describe('getSinglePost', () => {
    it('should return a post by id on success', async () => {
      const mockPost = { id: 1, title: 'Post 1' };
      db.query.mockResolvedValue({ rows: [mockPost] });
      
      await getSinglePost(mockReq, mockRes);
      
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [mockReq.params.id]);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPost);
    });
    
    it('should return 404 if post not found', async () => {
      db.query.mockResolvedValue({ rows: [] });
      
      await getSinglePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
  });
  
  describe('createPost', () => {
    it('should create a new post on success', async () => {
      const mockCreatedPost = { id: 1, ...mockReq.body };
      db.query.mockResolvedValue({ rows: [mockCreatedPost] });
      
      await createPost(mockReq, mockRes);
      
      expect(postHelpers.validatePostData).toHaveBeenCalled();
      expect(db.query).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post created successfully', post: mockCreatedPost });
    });
  });
  
  describe('updatePost', () => {
    it('should update a post on success', async () => {
      const mockUpdatedPost = { id: 1, ...mockReq.body };
      db.query.mockResolvedValueOnce({ rows: [{ user_id: 123 }] }); // Check ownership
      db.query.mockResolvedValueOnce({ rows: [mockUpdatedPost] }); // Update post
      
      await updatePost(mockReq, mockRes);
      
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post updated successfully', post: mockUpdatedPost });
    });
  });
  
  describe('deletePost', () => {
    it('should delete a post on success', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ user_id: 123 }] }); // Check ownership
      db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Delete post
      
      await deletePost(mockReq, mockRes);
      
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Post deleted successfully' });
    });
  });
}); 