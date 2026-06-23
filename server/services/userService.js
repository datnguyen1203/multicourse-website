const Users = require('../models/User');
const { deleteAvatarFromCloudinary } = require('../utils/cloudinaryHelper');

const userService = {

    // Create a new user
    async createUser(userData) {
        try {
            const user = new Users(userData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    },

    //Get all users
    async getAllUsers() {
        try {
            const users = await Users.find();
            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    },

    // Get user by ID
    async getUserById(userId) {
        try {
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Error fetching user: ' + error.message);
        }
    },

    // Update user details
    async updateUser(userId, updateData) {
        try {
            const user = await Users.findByIdAndUpdate(userId, updateData, { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    },

    // Delete a user
    async deleteUser(userId) {
        try {
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Delete avatar from Cloudinary if it exists
            if (user.avatar_url && !user.avatar_url.includes('res-console')) {
                await deleteAvatarFromCloudinary(user.avatar_url);
            }

            // Delete user from database
            const deletedUser = await Users.findByIdAndDelete(userId);
            return deletedUser;
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    },

    // Upload/Update user avatar
    async uploadAvatar(userId, fileUrl) {
        try {
            // Get current user to check if avatar already exists
            const currentUser = await Users.findById(userId);
            if (!currentUser) {
                throw new Error('User not found');
            }

            // Delete old avatar from Cloudinary if it exists
            // Skip default avatar (from res-console.cloudinary.com)
            if (currentUser.avatar_url && !currentUser.avatar_url.includes('res-console')) {
                await deleteAvatarFromCloudinary(currentUser.avatar_url);
            }

            // Update user with new avatar URL
            const updatedUser = await Users.findByIdAndUpdate(
                userId,
                { avatar_url: fileUrl },
                { new: true }
            );

            return updatedUser;
        } catch (error) {
            throw new Error('Error uploading avatar: ' + error.message);
        }
    }
};

module.exports = userService;