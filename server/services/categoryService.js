const Category = require('../models/Category');

module.exports = {
    // Get all categories
    async getAllCategories() {
        try {
            return await Category.find();
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    },

    // Get category by ID
    async getCategoryById(categoryId) {
        try {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        } catch (error) {
            throw new Error('Error fetching category: ' + error.message);
        }
    },

    // Create a new category
    async createCategory(categoryData) {
        try {
            const newCategory = new Category(categoryData);
            await newCategory.save();
            return newCategory;
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    },

    // Update an existing category
    async updateCategory(categoryId, categoryData) {
        try {
            const updated = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
            if (!updated) {
                throw new Error('Category not found');
            }
            return updated;
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    },

    // Delete a category
    async deleteCategory(categoryId) {
        try {
            const deleted = await Category.findByIdAndDelete(categoryId);
            if (!deleted) {
                throw new Error('Category not found');
            }
            return deleted;
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    },

    // Change category status
    async changeCategoryStatus(categoryId, status) {
        try {
            const updated = await Category.findByIdAndUpdate(categoryId, { status }, { new: true });
            if (!updated) {
                throw new Error('Category not found');
            }
            return updated;
        } catch (error) {
            throw new Error('Error changing category status: ' + error.message);
        }
    }
};
