const express = require('express');
const router = express.Router();
const {
  getStore,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
} = require('../controllers/storeController');
const validationMiddleware = require('../middleware/validation');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getStore);
router.get('/:id', getStoreById);
router.post('/', authMiddleware, createStore);
router.put('/:id', authMiddleware, updateStore);
router.delete('/:id', authMiddleware, deleteStore);

module.exports = router;