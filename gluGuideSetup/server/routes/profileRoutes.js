const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require('../config/multerConfig');

router.get('/bio', profileController.getBio);
router.post('/setBio', profileController.setBio);
router.get('/dp', profileController.getDp);
router.post('/setDp', profileController.setDp);

module.exports = router;
