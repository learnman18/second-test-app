const prisma = require('../../config/prisma');

const getStoreService = async () => {
    return prisma.store.findMany({
        include: {
            user: true,
        },
    });
};

const getStoreByIdService = async (id) => {
    const storeId = Number(id);

    if (Number.isNaN(storeId)) {
        throw new Error('Invalid store ID');
    }

    return prisma.store.findUnique({
        where: { store_id: storeId },
        include: {
            user: true,
        },
    });
};

const createStoreService = async (storeData) => {
    console.log('inside createStoreService', storeData);
    const { store_name, store_email, userId } = storeData || {};
    console.log("storeData", storeData);
    const user_Id = Number(userId);

    if (!store_name) {
        throw new Error('store_name is required');
    }

    return prisma.store.create({
        data: {
            store_name,
            store_email,
            userId: user_Id,
        },
    });
};

const updateStoreService = async (id, storeData) => {
    const storeId = Number(id);

    if (Number.isNaN(storeId)) {
        throw new Error('Invalid store ID');
    }

    return prisma.store.update({
        where: { store_id: storeId },
        data: storeData,
    });
};

const deleteStoreService = async (id) => {
    const storeId = Number(id);

    if (Number.isNaN(storeId)) {
        throw new Error('Invalid store ID');
    }

    return prisma.store.delete({
        where: { store_id: storeId },
    });
};

module.exports = {
    getStoreService,
    getStoreByIdService,
    createStoreService,
    updateStoreService,
    deleteStoreService
};