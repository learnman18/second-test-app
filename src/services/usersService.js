const prisma = require('../../config/prisma');

const getUsers = async () => {
  return prisma.user.findMany({
    orderBy: { user_id: 'asc' },
    include: {
      stores: true,
        _count: {
          select: { stores: true }
        }
    },
  });
};

// const getUsersWithStores = async () => {
//   return prisma.user.findMany({
//     orderBy: { user_id: 'asc' },
//     include: {
//       stores: true,
//       _count: {
//         select: { stores: true },
//       },
//     },
//   });
// };

const getUserById = async (id) => {
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    throw new Error('Invalid user ID');
  }

  return prisma.user.findUnique({
    where: { user_id: userId },
    include: {
      stores: true,
        _count: {
          select: { stores: true }
        }
    },
  });
};

const createUser = async (userData) => {
  const { user_name, user_email } = userData || {};

  if (!user_name || !user_email) {
    throw new Error('user_name and user_email are required');
  }

  return prisma.user.create({
    data: {
      user_name,
      user_email,
    },
  });
};

const updateUser = async (id, userData) => {
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    throw new Error('Invalid user ID');
  }

  return prisma.user.update({
    where: { user_id: userId },
    data: {
      ...(userData.user_name && { user_name: userData.user_name }),
      ...(userData.user_email && { user_email: userData.user_email }),
    },
  });
};

const deleteUser = async (id) => {
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    throw new Error('Invalid user ID');
  }

  return prisma.user.delete({
    where: { user_id: userId },
  });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };