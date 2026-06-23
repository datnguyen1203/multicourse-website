const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const express = require('express');
const router = express.Router();

// Create a new user
router.post('/', authMiddleware, authorizationMiddleware('admin'), UserController.createUser);

// Get all users (requires authentication)
router.get('/', authMiddleware, authorizationMiddleware('admin'), UserController.getAllUsers);

// Get user by ID (requires authentication)
router.get('/:id', authMiddleware, authorizationMiddleware('admin'), UserController.getUserById);

// Update user details (requires authentication)
router.put('/:id', authMiddleware, authorizationMiddleware('admin'), UserController.updateUser);

// Upload/Update user avatar (uses user id from token)
router.post('/avatar', authMiddleware, uploadMiddleware.uploadAvatar.single('avatar'), UserController.uploadAvatar);

// Delete a user (requires admin role)
router.delete('/:id', authMiddleware, authorizationMiddleware('admin'), UserController.deleteUser);

module.exports = router;