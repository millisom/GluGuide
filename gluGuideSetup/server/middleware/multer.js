const multer = require('multer');
const path = require('path');

// Set up the multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Store uploaded images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set unique filename using timestamp
  }
});

// Create an upload instance that can handle single file uploads
const upload = multer({ storage: storage }).single('post_picture');

module.exports = upload;