const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getAllTags,
  getAuthorProfile,
  getUserPost,
  getPost,
  uploadPostImage,
  deletePostImage
} = require('../../controllers/postController');
const db = require('../../config/db');
const postHelpers = require('../../helpers/postHelpers');
const Profile = require('../../models/profileModel');
const Post = require('../../models/postModel');
const fs = require('fs');
const path = require('path');

// Mock dependencies
jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

jest.mock('fs', () => ({
  unlink: jest.fn((path, callback) => callback(null)),
  existsSync: jest.fn(() => true)
}));

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  dirname: jest.fn(path => path.split('/').slice(0, -1).join('/'))
}));

jest.mock('../../models/postModel', () => ({
  getAllPostsOrderedByTime: jest.fn(),
  getPostById: jest.fn(),
  deletePostById: jest.fn(),
  updateLikes: jest.fn(),
  getAllTags: jest.fn(),
  getAuthorProfileByUsername: jest.fn(),
  getPosts: jest.fn(),
  getUserIdByUsername: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  setPostImage: jest.fn()
}));

jest.mock('../../models/profileModel', () => ({
  getUserByName: jest.fn()
}));

jest.mock('../../helpers/postHelpers', () => ({
  formatPostData: jest.fn(post => post),
  validatePostData: jest.fn(() => ({ valid: true })),
  parseTagsFromRequest: jest.fn(tags => Array.isArray(tags) ? tags : []),
  deleteImageFile: jest.fn(),
  getImagePath: jest.fn((filename) => `/mock/path/${filename}`),
  createImageUrl: jest.fn((filename) => `http://localhost:8080/uploads/${filename}`)
}));

// Mock multer
jest.mock('../../config/multerConfig', () => ({
  single: jest.fn(() => (req, res, next) => {
    // Simulate file upload
    if (req.simulateFileUpload !== false) {
      req.file = { filename: 'test-image.jpg' };
    }
    next();
  })
}));

let originalConsoleError;

beforeAll(() => {
  // Store the original console.error
  originalConsoleError = console.error;
  // Replace console.error with a mock during tests
  console.error = jest.fn();
});

afterAll(() => {
  // Restore the original console.error after tests
  console.error = originalConsoleError;
});

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
      },
      simulateFileUpload: true
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
      const error = new Error('Database error');
      Post.getAllPostsOrderedByTime.mockRejectedValue(error);
      
      await getAllPosts(mockReq, mockRes);
      
      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch posts' });
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
  
  describe('getPost', () => {
    it('should return a post successfully', async () => {
      const mockPost = { id: 1, title: 'Post 1' };
      Post.getPostById.mockResolvedValue(mockPost);
      
      await getPost(mockReq, mockRes);
      
      expect(Post.getPostById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith(mockPost);
    });
    
    it('should return 404 if post not found', async () => {
      Post.getPostById.mockResolvedValue(null);
      
      await getPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
    
    it('should handle errors', async () => {
      const error = new Error('Database error');
      Post.getPostById.mockRejectedValue(error);
      
      await getPost(mockReq, mockRes);
      
      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('createPost', () => {
    it('should create a post successfully with file upload', async () => {
      const userId = 123;
      const createdPost = { id: 1, title: 'Test Post' };
      const postWithDetails = { ...createdPost, author: 'testuser' };
      
      Post.getUserIdByUsername.mockResolvedValue(userId);
      Post.createPost.mockResolvedValue(createdPost);
      Post.getPostById.mockResolvedValue(postWithDetails);
      
      await createPost(mockReq, mockRes);
      
      expect(Post.getUserIdByUsername).toHaveBeenCalledWith('testuser');
      expect(Post.createPost).toHaveBeenCalledWith(
        userId, 
        'Test Post', 
        'Test content', 
        'test-image.jpg', 
        ['test', 'mock']
      );
      expect(Post.getPostById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        post: postWithDetails
      });
    });
    
    it('should handle unauthorized users', async () => {
      mockReq.session.username = null;
      
      await createPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith('Unauthorized');
    });
    
    it('should handle missing title', async () => {
      mockReq.body.title = '';
      
      await createPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Title is required.'
      });
    });
    
    it('should handle file upload errors', async () => {
      // Force multer to call the error callback
      mockReq.simulateFileUpload = false;
      mockReq.simulateMulterError = true;
      
      // Mock multer to simulate an error
      require('../../config/multerConfig').single.mockImplementationOnce(() => (req, res, next) => {
        if (req.simulateMulterError) {
          next(new Error('File upload failed'));
        } else {
          next();
        }
      });
      
      await createPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'File upload failed' });
    });
  });
  
  describe('updatePost', () => {
    beforeEach(() => {
      Profile.getUserByName.mockResolvedValue([{ id: 123 }]);
      Post.updatePost.mockResolvedValue({ id: 1, title: 'Updated Post' });
    });
    
    it('should update a post successfully', async () => {
      await updatePost(mockReq, mockRes);
      
      expect(Profile.getUserByName).toHaveBeenCalledWith('testuser');
      expect(Post.updatePost).toHaveBeenCalledWith(
        '1', 123, 'Test Post', 'Test content', ['test', 'mock']
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Post updated successfully',
        post: { id: 1, title: 'Updated Post' }
      });
    });
    
    it('should handle unauthorized users', async () => {
      mockReq.session.username = null;
      
      await updatePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should handle user not found', async () => {
      Profile.getUserByName.mockResolvedValue([]);
      
      await updatePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
    
    it('should handle post not found or unauthorized to update', async () => {
      Post.updatePost.mockResolvedValue(null);
      
      await updatePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Post not found or not authorized to update'
      });
    });
    
    it('should handle errors during update', async () => {
      Post.updatePost.mockRejectedValue(new Error('Update failed'));
      
      await updatePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Update failed' });
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
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('uploadPostImage', () => {
    it('should upload an image for a post', async () => {
      const mockPost = { id: '1', post_picture: 'old-image.jpg' };
      Post.getPostById.mockResolvedValue(mockPost);
      Post.setPostImage.mockResolvedValue(1); // Return 1 for successful update
      
      // Directly execute middleware function then the controller
      const middleware = require('../../config/multerConfig').single('postImage');
      
      await new Promise(resolve => {
        middleware(mockReq, mockRes, async () => {
          await uploadPostImage(mockReq, mockRes);
          resolve();
        });
      });
      
      expect(postHelpers.deleteImageFile).toHaveBeenCalled();
      expect(Post.setPostImage).toHaveBeenCalledWith('1', 'test-image.jpg');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        imageUrl: 'http://localhost:8080/uploads/test-image.jpg'
      });
    });
    
    it('should handle post not found', async () => {
      Post.getPostById.mockResolvedValue({ id: '1', post_picture: 'old-image.jpg' });
      Post.setPostImage.mockResolvedValue(0); // Return 0 for no rows updated
      
      // Directly execute middleware function then the controller
      const middleware = require('../../config/multerConfig').single('postImage');
      
      await new Promise(resolve => {
        middleware(mockReq, mockRes, async () => {
          await uploadPostImage(mockReq, mockRes);
          resolve();
        });
      });
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
    
    it('should handle missing file', async () => {
      mockReq.simulateFileUpload = false;
      
      // Directly execute middleware function then the controller
      const middleware = require('../../config/multerConfig').single('postImage');
      
      await new Promise(resolve => {
        middleware(mockReq, mockRes, async () => {
          await uploadPostImage(mockReq, mockRes);
          resolve();
        });
      });
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No file uploaded' });
    });
    
    it('should handle errors during upload', async () => {
      Post.getPostById.mockRejectedValue(new Error('Database error'));
      
      // Directly execute middleware function then the controller
      const middleware = require('../../config/multerConfig').single('postImage');
      
      await new Promise(resolve => {
        middleware(mockReq, mockRes, async () => {
          await uploadPostImage(mockReq, mockRes);
          resolve();
        });
      });
      
      expect(console.error).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
  
  describe('deletePostImage', () => {
    it('should delete an image successfully', async () => {
      const mockPost = { id: 1, post_picture: 'image.jpg' };
      Post.getPostById.mockResolvedValue(mockPost);
      Post.setPostImage.mockResolvedValue(1); // Rows updated
      
      await deletePostImage(mockReq, mockRes);
      
      expect(postHelpers.getImagePath).toHaveBeenCalledWith('image.jpg', expect.anything());
      expect(postHelpers.deleteImageFile).toHaveBeenCalled();
      expect(Post.setPostImage).toHaveBeenCalledWith('1', null);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Image deleted successfully' });
    });
    
    it('should handle post or image not found', async () => {
      // Case 1: Post not found
      Post.getPostById.mockResolvedValue(null);
      
      await deletePostImage(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Image not found' });
      
      // Case 2: Post exists but has no image
      jest.clearAllMocks();
      mockRes.status.mockReturnThis(); // Reset the mock
      
      Post.getPostById.mockResolvedValue({ id: 1, post_picture: null });
      
      await deletePostImage(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Image not found' });
    });
    
    it('should handle post not found during image deletion', async () => {
      const mockPost = { id: 1, post_picture: 'image.jpg' };
      Post.getPostById.mockResolvedValue(mockPost);
      Post.setPostImage.mockResolvedValue(0); // No rows updated
      
      await deletePostImage(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
    
    it('should handle errors during image deletion', async () => {
      Post.getPostById.mockRejectedValue(new Error('Database error'));
      
      await deletePostImage(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
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
    
    it('should handle undefined likes array', async () => {
      const mockPost = { id: 1 }; // No likes array
      Post.getPostById.mockResolvedValue(mockPost);
      Post.updateLikes.mockResolvedValue(true);
      
      await toggleLike(mockReq, mockRes);
      
      // Should add the user's ID to a new likes array
      expect(Post.updateLikes).toHaveBeenCalledWith('1', [123]);
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