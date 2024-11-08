const multer = require('multer');
const path = require('path');

// Set up the multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Store uploaded images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    // Set unique filename using timestamp to avoid file overwrites
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter (optional, to only allow image file types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];  // Only allow specific image types
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept the file
  } else {
    cb(new Error('Invalid file type'), false);  // Reject the file
  }
};

// Create an upload instance that handles single file uploads
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('post_picture');  // Handle 'post_picture' field

// Export the upload middleware
module.exports = upload;
