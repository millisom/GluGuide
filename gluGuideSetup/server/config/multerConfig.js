const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ 
    storage: storage, 
    limits: { 
        fileSize: 10 * 1024 * 1024,
        fieldSize: 10 * 1024 * 1024,
        fields: 10
    } 
});

module.exports = upload;
