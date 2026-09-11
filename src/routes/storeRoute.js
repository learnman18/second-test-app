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

router.get('/', getStore);
router.get('/:id', getStoreById);
router.post('/', createStore);
router.put('/:id', updateStore);
router.delete('/:id', deleteStore);

module.exports = router;