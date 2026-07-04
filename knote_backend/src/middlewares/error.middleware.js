const { ApiError } = require("../utils/apiResponse");

function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

function errorHandler(err, req, res, _next) {
  let { statusCode, message, errors } = err;

  if (!(err instanceof ApiError)) {
    statusCode = 500;
    message = "Internal server error";
    errors = [];

    if (err.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(err.errors)
        .map((e) => e.message)
        .join(", ");
    } else if (err.code === 11000) {
      statusCode = 409;
      const field = Object.keys(err.keyValue || {})[0];
      message = field ? `${field} is already in use` : "Duplicate value";
    } else if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid identifier format";
    }
  }

  statusCode = statusCode || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message: message || "Internal server error",
    errors: errors || [],
  });
}

module.exports = { notFound, errorHandler };
