const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("authHeader", authHeader);
    if (!authHeader) {
      throw new Error('Token required');
    }

    const token = authHeader.split(' ')[1];
    // console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded", decoded);
    req.user = decoded;
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
const authorize = (allowedRole) => {
  return (req, res, next) => {
    //here we have userRole becuase in JWT we have userRole we can check authSerivce.js file token variable,
    // this valus is coming from jWT payload
    console.log('req.body', req.body);
    console.log('req.user', req.user.userRole);
    if (req.user.userRole !== allowedRole) {
      return res.status(403).json({
        message: `forbidden - user needs to be admin`
      })
    }
    next();
  }
}

module.exports = { authMiddleware, authorize };