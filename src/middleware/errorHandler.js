const prismaErrorHandler = require("./prismaErrorHandler");

//we can recognize err handler with err parameter.
const errorHandler = (err, req, res, next) => {
  console.error('err - ', err);

  const prismaError = prismaErrorHandler(err);
  const statusCode =
    prismaError?.statusCode || err.statusCode || 500;

  console.log("NODE_ENV:", process.env.NODE_ENV);
  // console.log("Error stack:", err.stack);
  if (process.env.NODE_ENV === "development") {
    console.error('inside dev');
    return res.status(statusCode).json({
      status: err.isOperational ? "fail" : "error",
      message: err.message,
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