const fs = require('fs');
const prisma = require('../../config/prisma');

//page and limit is query params for pagination, we will use them to get the users in pages, currently hardcoded from controller file, we can check.
const getUsers = async ({ page, limit, sortBy, order, search }) => {
  //consider limit is 5 records on one page, limits can differ based on our requirement - users?page=1 as limit is hardcoded to 5, then it will display
  //first 5 records on page 1 and at that skip is 0, once we make the change users?page=2, then it will display next 5 records on page 2 and at that 
  //time it will skip previous 5, and similary it will do for other page and for that we have this formula.
  //skip = (page -1) * limit which is if we are on page 3, skiap = (3-1) * 5 = 10, if we are on page 4, skip = (4-1) * 5 = 15, and it will skip those records
  //to display
  const skip = (page - 1) * limit;
  return prisma.user.findMany({
    orderBy: { [sortBy]: order }, //sorting and order by.
    include: {
      stores: true, // return store details.
      _count: { //return count of total store.
        select: { stores: true }
      }
    },
    where: { //search functionality - we can search by user_name, we can add more fields if required.
      user_name: {
        contains: search,
        mode: 'insensitive'
      }
    },
    skip: skip, //use for pagiantion
    take: limit //use for pagiantion
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

const uploadProfileImage = async (id, imagePath) => {
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    throw new Error('Invalid user ID');
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      user_id: userId
    }
  });

  const oldImagePath = existingUser.profile_image;

  if (!existingUser) {
    throw new Error('User not found');
  }

  console.log(
    'Old profile image:',
    existingUser.profile_image
  );

  //image upload/update logic.
  const updateUser = prisma.user.update({
    where: {
      user_id: userId
    },
    data: {
      profile_image: imagePath
    }
  });

  //deleting the image if it exists, so that we don't have multiple images stored for the same user and also to save storage space.
  if (oldImagePath) {
    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error('Error deleting old profile image:', err);
      } else {
        console.log('Old profile image deleted successfully');
      }
    });
  }

  return updateUser;
};

module.exports = { getUsers, getUserById, updateUser, deleteUser, uploadProfileImage };