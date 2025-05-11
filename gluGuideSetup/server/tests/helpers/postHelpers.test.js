const { 
  parseTagsFromRequest,
  formatPostResponse,
  createImageUrl,
  getImagePath
} = require('../../helpers/postHelpers');
const fs = require('fs');
const path = require('path');

// Mock fs
jest.mock('fs', () => ({
  unlink: jest.fn((path, callback) => callback())
}));

describe('postHelpers', () => {
  describe('parseTagsFromRequest', () => {
    it('should parse comma-separated string tags', () => {
      const result = parseTagsFromRequest('react,node,javascript');
      expect(result).toEqual(['react', 'node', 'javascript']);
    });

    it('should handle whitespace and empty tags', () => {
      const result = parseTagsFromRequest('react, node, ,javascript ');
      expect(result).toEqual(['react', 'node', 'javascript']);
    });

    it('should handle array of tags', () => {
      const result = parseTagsFromRequest(['react', 'node', 'javascript']);
      expect(result).toEqual(['react', 'node', 'javascript']);
    });

    it('should handle undefined tags', () => {
      const result = parseTagsFromRequest(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('formatPostResponse', () => {
    it('should format post with likes array', () => {
      const post = {
        id: 1,
        title: 'Test',
        likes: [1, 2, 3]
      };
      const result = formatPostResponse(post);
      expect(result).toEqual({
        id: 1,
        title: 'Test',
        likes: [1, 2, 3],
        likes_count: 3
      });
    });

    it('should format post with likes_count', () => {
      const post = {
        id: 1,
        title: 'Test',
        likes_count: 5
      };
      const result = formatPostResponse(post);
      expect(result).toEqual({
        id: 1,
        title: 'Test',
        likes_count: 5
      });
    });

    it('should handle null post', () => {
      const result = formatPostResponse(null);
      expect(result).toBeNull();
    });
  });

  describe('getImagePath', () => {
    it('should create correct image path', () => {
      const baseDir = '/app/controllers';
      const filename = 'image.jpg';
      const expectedPath = path.join(baseDir, '..', 'uploads', 'image.jpg');
      const result = getImagePath(filename, baseDir);
      expect(result).toEqual(expectedPath);
    });

    it('should handle null filename', () => {
      const result = getImagePath(null, '/app');
      expect(result).toBeNull();
    });
  });

  describe('createImageUrl', () => {
    it('should create correct image URL', () => {
      const req = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:8080')
      };
      const filename = 'image.jpg';
      const result = createImageUrl(req, filename);
      expect(result).toBe('http://localhost:8080/uploads/image.jpg');
    });

    it('should handle null filename', () => {
      const req = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:8080')
      };
      const result = createImageUrl(req, null);
      expect(result).toBeNull();
    });
  });
}); 