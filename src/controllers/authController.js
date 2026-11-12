const { registerUser, loginUser } = require('../services/authService');

const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    //if we want to see primsa specific error without going to cenrazlied error handling code, we can see the prisma error message with below line.
    // res.status(400).json({ message: 'Error registering user', error: error.message });
    //this next forwards to error handler middleware.
    return next(error); // Pass the error to the centralized error handling middleware
  }
}

const loginUserController = async (req, res) => {
  // console.log('req body', req.body);
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ message: 'User logged in', token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in user', error: error.message });
  }
}

module.exports = { registerUserController, loginUserController };