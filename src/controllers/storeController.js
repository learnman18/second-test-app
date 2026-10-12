const {
  getStoreService,
  getStoreByIdService,
  createStoreService,
  updateStoreService,
  deleteStoreService
} = require('../services/storeService');

const getStore = async (req, res) => {
  try {
    const stores = await getStoreService();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stores', error: error.message });
  }
};

const getStoreById = async (req, res) => {
  console.log('params', req.params);
  try {
    const store = await getStoreByIdService(req.params.id);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    return res.status(200).json(store);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

const createStore = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const store = await createStoreService(req.body);
    res.status(201).json({ message: 'Store created', store });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const updateStore = async (req, res) => {
//   try {
//     const store = await updateStoreService(req.params.id, req.body);
//     res.status(200).json({ message: 'Store updated', store });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

//we have update the updateStore contoller, so that we can pass the ID of the user who has logged in, the third parameter - req.user.userId we are getting 
//it from the JWT because JWT has the details like which user has logged in and ID of the user so we are passing it here to add some check to prevent
//any user from updating or deleting the store of any other user, for example if see the above the commented out code you will we are calling the 
//updateStoreService funciton and here we have all the req.body detials But the service doesn't know who is making the request, so with the help of 
//req.user.userId we can uderstand who has logged in and if the user.userId id is same as store.userId it will let you update or delete or else it won't.
//for user check please checl service file.
const updateStore = async (req, res) => {
  try {
    const store = await updateStoreService(
      req.params.id,
      req.body,
      req.user.userId
    );

    res.status(200).json({
      message: 'Store updated',
      store
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const store = await deleteStoreService(req.params.id);
    res.status(200).json({ message: 'Store deleted', store });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStore,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
};