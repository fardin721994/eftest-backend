class HttpError extends Error {
  constructor(message, statusCode) {
    super(message); // Adds a "message" property
    this.statusCode = statusCode; // Adds a "statusCode" property
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = HttpError;
