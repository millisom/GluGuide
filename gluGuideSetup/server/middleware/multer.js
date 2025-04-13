const multer = require('multer');
const path = require('path');

// Set up the multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); // Use absolute path for storage
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename using timestamp
  },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add allowed MIME types
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.')); // Reject the file
  }
};

// Create an upload instance with storage, file filtering, and error handling
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set file size limit (5MB)
  },
}).single('post_picture');

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle multer-specific errors
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    } else if (err) {
      // Handle general errors
      return res.status(400).json({ error: 'File upload failed: ' + err.message });
    }
    // If no errors, proceed to the next middleware or route handler
    next();
  });
};
