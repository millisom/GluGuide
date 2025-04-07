const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

// User management routes
router.post('/admin/createUser', adminMiddleware, adminController.createUser);
router.get('/admin/users', adminMiddleware, adminController.listUsers);
router.get('/admin/user/:id', adminMiddleware, adminController.getSingleUser);
router.get(
  '/admin/user/:id/avatar',
  adminMiddleware,
  adminController.getUserAvatar
);
router.delete('/admin/user/:id', adminMiddleware, adminController.deleteUser);
router.delete(
  '/admin/user/:id/avatar',
  adminMiddleware,
  adminController.deleteUserAvatar
);
router.put('/admin/user/:id', adminMiddleware, adminController.editUser);

// Post management routes
router.put('/admin/posts/:id', adminMiddleware, adminController.editPost);
router.delete('/admin/posts/:id', adminMiddleware, adminController.deletePost);

// Comment management routes
router.put('/admin/comments/:id', adminMiddleware, adminController.editComment);
router.delete(
  '/admin/comments/:id',
  adminMiddleware,
  adminController.deleteComment
);

module.exports = router;
