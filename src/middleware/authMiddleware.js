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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    // console.log("decoded", decoded);
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};

//authrize user who has certain permission or not for example only admin can delete or else user will get forbidden error.
const authorize = (allowedRole) => {
  return (req, res, next) => {
    if (req.user_role !== allowedRole) {
      return res.status(403).json({
        message: 'forbidden'
      })
    }
    next();
  }
}

module.exports = { authMiddleware, authorize };