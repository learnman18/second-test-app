const {
  getUsers: getUsersService,
  getUserById: getUserByIdService,
  // createUser: createUserService,
  updateUser: updateUserService,
  deleteUser: deleteUserService,
  uploadProfileImage: uploadProfileImageService,
  createUserWithStore,
  updateMyProfileService,
  changeMyPasswordService
} = require('../services/usersService');
const AppError = require('../utils/AppError');

//here we are not using next() because we are handling errors in the controller itself and sending appropriate responses to the client.
//If we were to use next(), we would be passing the error to an error-handling middleware, which is not necessary in this case since we are already
// handling the errors and sending responses directly from the controller functions. const getUsers = async (req, res, next) => {}

const getUsers = async (req, res) => {
  try {
    //for pagination.
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1 || !Number.isInteger(page) || !Number.isInteger(limit) || limit >= 100) {
      return res.status(400).json({ message: 'Invalid page or limit parameter' });
    }
    //for sorting and order by - means which field to be sort and in which order, for example user_name in asc order.
    const sortBy = req.query.sortBy || 'user_id';
    const order = req.query.order || 'asc';
    const allowedSortFields = [
      'user_id',
      'user_name',
      'user_email'
    ];
    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({ message: 'Invalid sort field' });
    }
    if (order !== 'asc' && order !== 'desc') {
      return res.status(400).json({ message: 'Invalid order parameter/order' });
    }

    //search functionality - we can search by user_name and user_email, we can add more fields if required.
    const search = req.query.search || '';
    const users = await getUsersService({ page, limit, sortBy, order, search });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// const getUsersWithStores = async (req, res) => {
//     try {
//         const users = await getUsersWithStoresService();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching users with stores', error: error.message });
//     }
// };

const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    /*
      //when search user does not exist.
      // 1. Controller detects that the user doesn't exist.
      // 2. Controller creates an error with statusCode = 404.
      // 3. next(error) forwards it to Express.
      // 4. Your centralized error middleware sends the response.
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
    */
    //we have created one common file for 404 error, instead of typing the above commented out code again and again in multiple controller file.
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return res.status(200).json(user);

  } catch (error) {
    return next(error); //next(error) will pass the error to the centralized error handling middleware, which will handle the error and send an appropriate response to the client.
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    // res.status(400).json({ message: "user not created", error: error.message });
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    res.status(200).json({ message: 'User updated', user });
  } catch (error) {
    // res.status(400).json({ message: error.message });
    return next(error);
  }
};

const updateMyProfileController = async (req, res, next) => {
  // console.log('updateMyProfileController', req);
  try {
    const userId = req.user.userId; // reading the userID from the JWT so no need to add userId in query params.
    const user = await updateMyProfileService(userId, req.body);
    res.status(200).json({
      message: 'profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
}

//to update the password we need to go to /users/me/password route and we need to pass currentPassword and newPassword in request body to update the password.
const changeMyPasswordController = async (req, res, next) => {
  try {
    const userId = req.user.userId; //userID coming from JWT.
    const { currentPassword, newPassword } = req.body;

    await changeMyPasswordService(
      userId,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await deleteUserService(req.params.id);
    res.status(200).json({ message: 'User deleted', user });
  } catch (error) {
    // res.status(400).json({ message: error.message });
    return next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    console.log('req.file', req.file);
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: 'Image is required'
      });
    }

    const user = await uploadProfileImageService(id, req.file.path);

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      user
    });

  } catch (error) {
    next(error);
  }
};

const transactionController = async (req, res, next) => {
  try {
    const users = await createUserWithStore();
    res.status(200).json({
      message: "user created successfully",
      users
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, uploadProfileImage, transactionController, updateMyProfileController, changeMyPasswordController };