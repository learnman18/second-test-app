const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
  transactionController,
  updateMyProfileController,
  changeMyPasswordController
} = require('../controllers/usersController');
const validationMiddleware = require('../middleware/validation');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createUserWithStore } = require('../services/usersService');
const { validate } = require('../middleware/validation');
const { updateMyProfileSchema, changeMyPasswordSchema } = require('../validators/userValidator');

router.get('/', authMiddleware, getUsers);
router.patch('/me', authMiddleware, validate(updateMyProfileSchema), updateMyProfileController); // Update current user's profile, this reads the userID from JWT so the API endpoint will be /users/me no need to add query param like /users/me/:id
router.patch('/me/password', authMiddleware, validate(changeMyPasswordSchema), changeMyPasswordController);
router.get('/:id', authMiddleware, getUserById);
// router.post('/', validationMiddleware, createUser); //we are going to comment out createUser function because we will use registerUser  function from authService.js to create user and hash thepassword before saving it to the database. We will use bcrypt to hash the password.
router.put('/:id', authMiddleware, authorize('admin'), updateUser); //user needs to be admin to update and delete user details
router.delete('/:id', authMiddleware, authorize('admin'), deleteUser);
router.post('/:id/profile-image', upload.single('image'), uploadProfileImage); //another users endpoint to upload profile picture.
router.post('/create-with-store', transactionController); //testing route - created this route to test transactions feature.
module.exports = router;