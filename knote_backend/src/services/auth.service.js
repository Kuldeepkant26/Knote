const User = require("../models/user.model");
const PendingSignup = require("../models/pendingSignup.model");
const { ApiError } = require("../utils/apiResponse");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateRawToken,
  hashToken,
  generateOtp,
} = require("../utils/token.util");
const { sendPasswordResetEmail, sendOtpEmail } = require("./email.service");
const { env } = require("../config/env");

const MAX_REFRESH_TOKENS_PER_USER = 5;

// Starts (or restarts) the signup flow: stores the details in a short-lived
// PendingSignup and emails an OTP. The real User is only created once the
// OTP is verified — no unverified accounts ever exist in the User collection.
async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const otp = generateOtp();
  const otpHash = hashToken(otp);
  const otpExpires = new Date(Date.now() + env.otpExpiresMin * 60 * 1000);

  // Re-submitting signup for an email that's already pending restarts the
  // process with a fresh OTP and the latest details, rather than blocking.
  let pending = await PendingSignup.findOne({ email });
  if (pending) {
    pending.name = name;
    pending.password = password; // re-triggers the pre-save hash hook
    pending.otpHash = otpHash;
    pending.otpExpires = otpExpires;
  } else {
    pending = new PendingSignup({ name, email, password, otpHash, otpExpires });
  }
  await pending.save();

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    // Don't leave a pending signup around whose OTP nobody received.
    await PendingSignup.deleteOne({ _id: pending._id });
    throw new ApiError(500, "Failed to send verification email. Please try again later.");
  }

  return { email };
}

async function verifyOtp({ email, otp }) {
  const pending = await PendingSignup.findOne({ email }).select("+password +otpHash +otpExpires");
  if (!pending) {
    throw new ApiError(400, "No pending signup found for this email. Please sign up again.");
  }

  if (pending.otpExpires.getTime() < Date.now()) {
    await PendingSignup.deleteOne({ _id: pending._id });
    throw new ApiError(400, "This code has expired. Please sign up again to get a new one.");
  }

  if (hashToken(otp) !== pending.otpHash) {
    throw new ApiError(400, "Invalid verification code");
  }

  const existingUser = await User.findOne({ email: pending.email });
  if (existingUser) {
    await PendingSignup.deleteOne({ _id: pending._id });
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = new User({ name: pending.name, email: pending.email, password: pending.password });
  user.$locals.skipPasswordHash = true; // pending.password is already a bcrypt hash
  await user.save();

  await PendingSignup.deleteOne({ _id: pending._id });

  return issueTokens(user);
}

async function resendOtp(email) {
  const pending = await PendingSignup.findOne({ email });
  if (!pending) {
    throw new ApiError(400, "No pending signup found for this email. Please sign up again.");
  }

  const otp = generateOtp();
  pending.otpHash = hashToken(otp);
  pending.otpExpires = new Date(Date.now() + env.otpExpiresMin * 60 * 1000);
  await pending.save();

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    throw new ApiError(500, "Failed to send verification email. Please try again later.");
  }
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
  verifyOtp,
  resendOtp,
  loginUser,
  refreshTokens,
  logoutUser,
  forgotPassword,
  resetPassword,
};
