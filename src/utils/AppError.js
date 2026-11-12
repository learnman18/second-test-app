/*
  Understand the important parts:
  - extends Error: Our class inherits JavaScript's built-in Error functionality.
  - super(message): Passes the message to the parent Error class.
  - this.statusCode: Stores the HTTP status code.
  - Error.captureStackTrace(): Helps maintain a clean stack trace in Node.js.
  - isOperational?: It helps us distinguish errors intentionally created by our application from unexpected errors.
*/

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;