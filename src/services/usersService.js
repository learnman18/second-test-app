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
//we are goiing to comment out createUser function because we will use registerUser  function from authService.js to create user and hash the
//password before saving it to the database. We will use bcrypt to hash the password.

// const createUser = async (userData) => {
//   const { user_name, user_email } = userData || {};

//   if (!user_name || !user_email) {
//     throw new Error('user_name and user_email are required');
//   }

//   return prisma.user.create({
//     data: {
//       user_name,
//       user_email,
//     },
//   });
// };

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
      ...(userData.password && { password: userData.password }),
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