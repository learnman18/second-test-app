const express = require('express');
const router = express.Router();
const { registerUserController, loginUserController } = require('../controllers/authController');
const { loginUser } = require('../services/authService');
const { validate } = require('../middleware/validation');
const { registerSchema } = require('../validators/authValidator');
const loginRateLimiter = require('../middleware/loginRateLimiter');

// router.post('/register', validate(registerSchema), registerUserController);
router.post('/register', validate(registerSchema), registerUserController);
router.post('/login', loginRateLimiter, loginUserController);

module.exports = router;