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

const updateStore = async (req, res) => {
  try {
    const store = await updateStoreService(req.params.id, req.body);
    res.status(200).json({ message: 'Store updated', store });
  } catch (error) {
    res.status(400).json({ message: error.message });
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