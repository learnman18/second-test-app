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

module.exports = {authMiddleware};