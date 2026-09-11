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


router.get('/', getUsers);
router.get('/:id' , getUserById);
router.post('/', validationMiddleware, createUser);
router.put('/:id', validationMiddleware, updateUser);
router.delete('/:id', validationMiddleware, deleteUser);

module.exports = router;