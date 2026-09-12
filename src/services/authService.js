
const prisma = require('../../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// const hashPassword = async (password) => {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     return hashedPassword;
// }

//so now we will create user from the registerUser function and we will hash the password before saving it
//to the database. We will use bcrypt to hash the password. We will also create a loginUserService function to
//login the user. We will compare the hashed password with the password entered by the user. If they match, we
//will return the user object. If they don't match, we will throw an error.

//in place of using POST /users from userService.js to create user, we will use POST /auth/register to register user and
//POST /auth/login to login user.

const registerUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
        data: {
            user_name: userData.user_name,
            user_email: userData.user_email,
            password: hashedPassword
        }
    });
    return user;
};

const loginUser = async(userData) => {
    const {user_email, password} = userData;
    // console.log("user_email", user_email);
    // console.log("password", password);
    const user = await prisma.user.findUnique({
    where: {
      user_email,
    },
  });

  if (!user) {
    throw new Error('Invalid email');
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }
  const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });
  return token;

}

module.exports = { registerUser, loginUser };