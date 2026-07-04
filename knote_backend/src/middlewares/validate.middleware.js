const { validationResult } = require("express-validator");
const { ApiError } = require("../utils/apiResponse");

function validate(req, _res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formattedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  next(new ApiError(422, "Validation failed", formattedErrors));
}

module.exports = validate;
