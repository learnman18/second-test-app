const express = require('express');
const router = express.Router();
const { registerUserController, loginUserController } = require('../controllers/authController');
const { loginUser } = require('../services/authService');
const { validate } = require('../middleware/validation');
const { registerSchema } = require('../validators/authValidator');

// router.post('/register', validate(registerSchema), registerUserController);
router.post('/register', validate(registerSchema), registerUserController);
router.post('/login', loginUserController);

module.exports = router;