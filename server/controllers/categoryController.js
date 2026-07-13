const CategoryService = require('../services/categoryService');

const categoryController = {
    async getAllCategories(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    },

    async getCategoryById(req, res) {
        try {
            const categoryId = req.params.id;
            const category = await CategoryService.getCategoryById(categoryId);
            if (category) {
                res.status(200).json(category);
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch category' });
        }
    },

    async createCategory(req, res) {
        try {
            const categoryData = req.body;
            const newCategory = await CategoryService.createCategory(categoryData);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create category' });
        }
    },

    async updateCategory(req, res) {
        try {
            const categoryId = req.params.id;
            const categoryData = req.body;
            const updated = await CategoryService.updateCategory(categoryId, categoryData);
            if (updated) {
                res.status(200).json(updated);
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update category' });
        }
    },

    async deleteCategory(req, res) {
        try {
            const categoryId = req.params.id;
            const deleted = await CategoryService.deleteCategory(categoryId);
            if (deleted) {
                res.status(200).json({ message: 'Category deleted successfully' });
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete category' });
        }
    },

    async changeCategoryStatus(req, res) {
        try {
            const categoryId = req.params.id;
            const { status } = req.body;
            const updated = await CategoryService.changeCategoryStatus(categoryId, status);
            if (updated) {
                res.status(200).json(updated);
            } else {
                res.status(404).json({ error: 'Category not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to change category status' });
        }
    }
};

module.exports = categoryController;
