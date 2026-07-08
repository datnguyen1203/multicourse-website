const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorizationMiddleware = require('../middlewares/authorizationMiddleware');
const CategoryController = require('../controllers/categoryController');

// Public: get all categories
router.get('/', CategoryController.getAllCategories);

// Public: get category by id
router.get('/:id', CategoryController.getCategoryById);

// Create category (admin only)
router.post('/', authMiddleware, authorizationMiddleware('admin'), CategoryController.createCategory);

// Update category (admin only)
router.put('/:id', authMiddleware, authorizationMiddleware('admin'), CategoryController.updateCategory);

// Delete category (admin only)
router.delete('/:id', authMiddleware, authorizationMiddleware('admin'), CategoryController.deleteCategory);

// Change status (admin only)
router.patch('/:id/status', authMiddleware, authorizationMiddleware('admin'), CategoryController.changeCategoryStatus);

module.exports = router;
