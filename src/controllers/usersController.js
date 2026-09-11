const {
    getUsers: getUsersService,
    getUserById: getUserByIdService,
    createUser: createUserService,
    updateUser: updateUserService,
    deleteUser: deleteUserService,
} = require('../services/usersService');

//here we are not using next() because we are handling errors in the controller itself and sending appropriate responses to the client.
//If we were to use next(), we would be passing the error to an error-handling middleware, which is not necessary in this case since we are already
// handling the errors and sending responses directly from the controller functions. const getUsers = async (req, res, next) => {}

const getUsers = async (req, res) => {
    try {
        const users = await getUsersService();
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

const getUserById = async (req, res) => {
    try {
        const user = await getUserByIdService(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const user = await createUserService(req.body);
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        res.status(400).json({ message: "user not created", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await updateUserService(req.params.id, req.body);
        res.status(200).json({ message: 'User updated', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await deleteUserService(req.params.id);
        res.status(200).json({ message: 'User deleted', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };