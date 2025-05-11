const fs = require('fs');
const path = require('path');

/**
 * Parses tags from request body
 * @param {*} tags - Tags from request body
 * @returns {Array} - Array of parsed tags
 */
const parseTagsFromRequest = (tags) => {
  let tagsArray = [];
  if (tags && typeof tags === 'string') {
    // Split tags by comma
    tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  } else if (Array.isArray(tags)) {
    // Filter out empty strings
    tagsArray = tags.filter(tag => typeof tag === 'string' && tag.trim()).map(tag => tag.trim());
  }
  return tagsArray;
};

/**
 * Delete image file from uploads directory
 * @param {string} imagePath - Path to the image file
 */
const deleteImageFile = (imagePath) => {
  if (!imagePath) return;
  
  try {
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting image:', err);
    });
  } catch (error) {
    console.error('Error during image deletion:', error);
  }
};

/**
 * Get the full path to an image in the uploads directory
 * @param {string} filename - The filename of the image
 * @param {string} baseDir - The base directory path
 * @returns {string} - The full path to the image
 */
const getImagePath = (filename, baseDir) => {
  if (!filename) return null;
  return path.join(baseDir, '..', 'uploads', path.basename(filename));
};

/**
 * Create a URL for an uploaded image
 * @param {Object} req - Express request object
 * @param {string} filename - The filename of the image
 * @returns {string} - The URL to access the image
 */
const createImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

/**
 * Format post data for response
 * @param {Object} post - The post data from database
 * @returns {Object} - Formatted post object
 */
const formatPostResponse = (post) => {
  if (!post) return null;
  
  // Format likes count if needed
  const likesCount = post.likes_count || (post.likes ? post.likes.length : 0);
  
  return {
    ...post,
    likes_count: likesCount
  };
};

module.exports = {
  parseTagsFromRequest,
  deleteImageFile,
  getImagePath,
  createImageUrl,
  formatPostResponse
}; 