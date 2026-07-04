const asyncHandler = require("express-async-handler");
const { verifyAccessToken } = require("../utils/token.util");
const { ApiError } = require("../utils/apiResponse");
const User = require("../models/user.model");

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Not authorized, token is invalid or expired");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new ApiError(401, "Not authorized, user no longer exists");
  }

  req.user = user;
  next();
});

module.exports = { protect };
