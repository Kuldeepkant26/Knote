const asyncHandler = require("express-async-handler");
const authService = require("../services/auth.service");
const { sendSuccess, ApiError } = require("../utils/apiResponse");
const { env } = require("../config/env");

const REFRESH_COOKIE_NAME = "refreshToken";

const isProduction = env.nodeEnv === "production";

const refreshCookieOptions = {
  httpOnly: true,
  // Frontend and backend are deployed on different origins, so the cookie is
  // cross-site: SameSite=None (+ Secure, which it requires) is mandatory in
  // production or the browser won't send it back on the refresh call. Lax
  // still works for local dev where both run on http://localhost.
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/", // broad path so /refresh and /logout both receive the cookie
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions);
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, { ...refreshCookieOptions, maxAge: undefined });
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { email: pendingEmail } = await authService.registerUser({ name, email, password });

  sendSuccess(res, 200, "We've sent a verification code to your email", { email: pendingEmail });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const { user, accessToken, refreshToken } = await authService.verifyOtp({ email, otp });

  setRefreshCookie(res, refreshToken);
  sendSuccess(res, 201, "Account verified successfully", { user, accessToken });
});

const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.resendOtp(email);

  sendSuccess(res, 200, "A new verification code has been sent to your email");
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser({ email, password });

  setRefreshCookie(res, refreshToken);
  sendSuccess(res, 200, "Logged in successfully", { user, accessToken });
});

const refresh = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const { user, accessToken, refreshToken } = await authService.refreshTokens(incomingToken);

  setRefreshCookie(res, refreshToken);
  sendSuccess(res, 200, "Token refreshed successfully", { user, accessToken });
});

const logout = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (req.user && incomingToken) {
    await authService.logoutUser(req.user._id, incomingToken);
  }

  clearRefreshCookie(res);
  sendSuccess(res, 200, "Logged out successfully");
});

const getMe = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authorized");
  }
  sendSuccess(res, 200, "Current user fetched successfully", { user: req.user.toSafeObject() });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);

  sendSuccess(res, 200, "If an account with that email exists, a password reset link has been sent");
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);

  sendSuccess(res, 200, "Password has been reset successfully. Please log in with your new password");
});

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
};
