const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/usersController');
const validationMiddleware = require('../middleware/validation');
const {authMiddleware} = require('../middleware/authMiddleware');


router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
// router.post('/', validationMiddleware, createUser); //we are going to comment out createUser function because we will use registerUser  function from authService.js to create user and hash thepassword before saving it to the database. We will use bcrypt to hash the password.
router.put('/:id', validationMiddleware, updateUser);
router.delete('/:id', validationMiddleware, deleteUser);

module.exports = router;