const { registerUser, loginUser } = require('../services/authService');

const registerUserController = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
}

const loginUserController = async (req, res) => {
    try {
        const token = await loginUser(req.body);
        res.status(200).json({ message: 'User logged in', token });
    } catch (error) {
        res.status(400).json({ message: 'Error logging in user', error: error.message });
    }
}

module.exports = { registerUserController, loginUserController };