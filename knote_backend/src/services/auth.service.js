const User = require("../models/user.model");
const { ApiError } = require("../utils/apiResponse");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateRawToken,
  hashToken,
} = require("../utils/token.util");
const { sendPasswordResetEmail } = require("./email.service");
const { env } = require("../config/env");

const MAX_REFRESH_TOKENS_PER_USER = 5;

async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  return issueTokens(user);
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password +refreshTokens");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return issueTokens(user);
}

async function issueTokens(user) {
  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push(refreshToken);
  if (user.refreshTokens.length > MAX_REFRESH_TOKENS_PER_USER) {
    user.refreshTokens = user.refreshTokens.slice(-MAX_REFRESH_TOKENS_PER_USER);
  }
  await user.save({ validateBeforeSave: false });

  return { user: user.toSafeObject(), accessToken, refreshToken };
}

async function refreshTokens(oldRefreshToken) {
  if (!oldRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  let payload;
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(payload.sub).select("+refreshTokens");
  if (!user || !user.refreshTokens.includes(oldRefreshToken)) {
    throw new ApiError(401, "Refresh token has been revoked");
  }

  user.refreshTokens = user.refreshTokens.filter((t) => t !== oldRefreshToken);
  await user.save({ validateBeforeSave: false });

  return issueTokens(user);
}

async function logoutUser(userId, refreshToken) {
  if (!refreshToken) return;
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: refreshToken },
  });
}

async function forgotPassword(email) {
  const user = await User.findOne({ email });
  // Always respond as if successful to avoid leaking which emails are registered.
  if (!user) return;

  const rawToken = generateRawToken();
  user.passwordResetToken = hashToken(rawToken);
  user.passwordResetExpires = Date.now() + env.resetTokenExpiresMin * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.clientUrl}/reset-password/${rawToken}`;

  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Failed to send password reset email. Please try again later.");
  }
}

async function resetPassword(rawToken, newPassword) {
  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires +refreshTokens");

  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = []; // invalidate all existing sessions
  await user.save();
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  forgotPassword,
  resetPassword,
};
