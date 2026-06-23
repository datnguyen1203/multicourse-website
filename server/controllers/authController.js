const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        const result = await authService.register(req.body);
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    }

}

module.exports = new AuthController();