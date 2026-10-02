const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
  transactionController
} = require('../controllers/usersController');
const validationMiddleware = require('../middleware/validation');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createUserWithStore } = require('../services/usersService');

router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
// router.post('/', validationMiddleware, createUser); //we are going to comment out createUser function because we will use registerUser  function from authService.js to create user and hash thepassword before saving it to the database. We will use bcrypt to hash the password.
router.put('/:id', authorize('admin'), updateUser); //user needs to be admin to update and delete user details
router.delete('/:id', authorize('admin'), deleteUser);
router.post('/:id/profile-image', upload.single('image'), uploadProfileImage); //another users endpoint to upload profile picture.
router.post('/create-with-store', transactionController); //testing route - created this route to test transactions feature.
module.exports = router;