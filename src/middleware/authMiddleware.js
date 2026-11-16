const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const prisma = require('../../config/prisma');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("authHeader", authHeader);
    if (!authHeader) {
      throw new Error('Token required');
    }

    const token = authHeader.split(' ')[1];
    // console.log("token", token);
    if (!token) {
      throw new AppError('Invalid authorization header', 401);
    }
    // Step 1: Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded);

    // Step 2: Fetch the latest user details from DB
    const user = await prisma.user.findUnique({
      where: {
        user_id: decoded.userId,
      },
      select: {
        user_id: true,
        user_email: true,
        user_role: true,
      },
    });

    // Step 3: Check whether the user still exists
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }
    // Step 4: Attach current DB details to req.user
    req.user = {
      userId: user.user_id,
      userEmail: user.user_email,
      userRole: user.user_role,
    };
    // console.log('req user', req.user);

    next();
  } catch (error) {
    next(error);
  }
};

/*
//flow
PostgreSQL
    ↓
user.user_role
    ↓
JWT creation
    ↓
userRole --> assigning this user.user_role in userSerive.js file in token variable.
    ↓
decoded JWT. --> decoding here in autMiddleware.js
    ↓
req.user.userRole
*/

//authrize user who has certain permission or not for example only admin can delete or else user will get forbidden error.
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    //here we have userRole becuase in JWT we have userRole we can check authSerivce.js file token variable,
    // this valus is coming from jWT payload
    console.log('req.body', req.body);
    console.log('req.user', req.user.userRole);
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }
    if (!allowedRoles.includes(req.user.userRole)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  }
}

module.exports = { authMiddleware, authorize };