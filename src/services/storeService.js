const prisma = require('../../config/prisma');

const getStoreService = async (userId) => {
  return prisma.store.findMany({
    where: {
      userId: Number(userId),
    },
    select: {
      store_id: true,
      store_name: true,
      store_email: true,
      location: true,
      user: {
        select: {
          user_id: true,
          user_name: true,
          user_email: true,
        },
      },
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
    select: {
      store_id: true,
      store_name: true,
      store_email: true,
      location: true,
      user: {
        select: {
          user_id: true,
          user_name: true,
          user_email: true,
        }
      }
    },
  });
};

const createStoreService = async (storeData, userId) => {
  const { store_name, store_email, location } = storeData || {};

  const authenticatedUserId = Number(userId);

  if (!store_name?.trim()) {
    throw new Error('store_name is required');
  }

  if (!Number.isInteger(authenticatedUserId) || authenticatedUserId <= 0) {
    throw new Error('Invalid user ID');
  }

  return prisma.store.create({
    data: {
      store_name: store_name.trim(),
      store_email: store_email?.trim() || null,
      location: location?.trim() || null,
      userId: authenticatedUserId,
    },
  });
};

//we have added the check if the store does not belong to logged in user, the user can't delete it.
//user.userId should be same as store.userId
const updateStoreService = async (id, storeData, userId) => {
  const storeId = Number(id);

  if (Number.isNaN(storeId)) {
    throw new Error('Invalid store ID');
  }

  const store = await prisma.store.findUnique({
    where: { store_id: storeId },
  });

  if (!store) {
    throw new Error('Store not found');
  }

  if (store.userId !== userId) {
    throw new Error('You do not own this store');
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