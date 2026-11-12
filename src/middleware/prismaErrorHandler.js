const { Prisma } = require("@prisma/client");

const prismaErrorHandler = (err) => {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (err.code) {
    // Unique constraint violation
    //all the err.code = P2002,3,25, we are seeing here all of them are prisma error code which we can see in logs.
    case "P2002":
      return {
        statusCode: 409,
        message: "A record with this value already exists.",
      };

    // Record not found
    case "P2025":
      return {
        statusCode: 404,
        message: "Record not found.",
      };

    // Foreign key constraint violation
    case "P2003":
      return {
        statusCode: 400,
        message: "Invalid reference. Related record does not exist.",
      };

    default:
      return null;
  }
};

module.exports = prismaErrorHandler;