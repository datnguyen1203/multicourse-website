const UserService = require('../services/userService');

const userController = {
    // Create a new user
    async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get all users
    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get user by ID
    async getUserById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    // Update user details
    async updateUser(req, res) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        try {
            const user = await UserService.deleteUser(req.params.id);
            res.status(200).json({ message: 'User deleted successfully', user });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    // Upload/Update user avatar
    async uploadAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const userId = req.user.id;
            const fileUrl = req.file.path;

            const user = await UserService.uploadAvatar(userId, fileUrl);
            res.status(200).json({
                message: 'Avatar uploaded successfully',
                user
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
module.exports = userController;