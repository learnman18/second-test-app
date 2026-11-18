const prismaErrorHandler = require("./prismaErrorHandler");

//we can recognize err handler with err parameter.
const errorHandler = (err, req, res, next) => {
  console.error('err - ', err);

  const prismaError = prismaErrorHandler(err);
  const jwtErrorMessages = {
    JsonWebTokenError: 'Invalid token',
    NotBeforeError: 'Token is not active',
    TokenExpiredError: 'Token has expired',
  };
  const jwtErrorMessage = jwtErrorMessages[err.name];
  console.log('primsa statuscode', prismaError?.statusCode, 'err statuscode', err.statusCode);
  const statusCode =
    prismaError?.statusCode || err.statusCode || (jwtErrorMessage ? 401 : 500);

  console.log("NODE_ENV:", process.env.NODE_ENV);
  // console.log("Error stack:", err.stack);
  if (process.env.NODE_ENV === "development") {
    console.error('inside dev');
    return res.status(statusCode).json({
      status: err.isOperational || jwtErrorMessage ? "fail" : "error",
      message: jwtErrorMessage || err.message,
      error: err,
      stack: err.stack,
    });
  }

  if (prismaError) {
    return res.status(prismaError.statusCode).json({
      status: "fail",
      message: prismaError.message,
    });
  }

  if (jwtErrorMessage) {
    return res.status(statusCode).json({
      status: "fail",
      message: jwtErrorMessage,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};

module.exports = errorHandler;