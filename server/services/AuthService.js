const Users = require('../models/User');
const UserWallet = require('../models/UserWallet');
const config = require('../configs/configs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
    async register(userData) {
        try {
            const user = new Users(userData);
            const newUser = await user.save();
            if (newUser.role === 'student' || newUser.role === 'teacher') {
                const userWallet = new UserWallet({ user_id: newUser._id });
                await userWallet.save();
            }
            return { success: true, message: 'User registered successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async login(email, password) {
        const user = await Users.findOne({ email });
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Invalid credentials' };
        }

        const token = jwt.sign(
            {
                user: {
                    id: user._id,
                    fullname: user.fullname,
                    avatar_url: user.avatar_url,
                    role: user.role
                }
            },
            config.secretKey,
            { expiresIn: '3d' }
        );

        return { success: true, token };
    }

}

module.exports = new AuthService();