const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../config/multerConfig');

router.get('/bio', profileController.getBio);
router.post('/setBio', profileController.setBio);
router.get('/dp', profileController.getDp);
router.post('/setDp', profileController.setDp);
router.delete('/deleteDp', profileController.deleteDp);
router.get('/getPosts', profileController.getPosts);
router.post('/deleteAccount', profileController.deleteAccount);
router.post('/editPost', profileController.updatePosts);

module.exports = router;
