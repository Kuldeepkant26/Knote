const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { env } = require("../config/env");

function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
}

function signRefreshToken(userId) {
  return jwt.sign({ sub: userId }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

function generateRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// 6-digit numeric code, e.g. "042817" (zero-padded, so always exactly 6 digits).
function generateOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRawToken,
  hashToken,
  generateOtp,
};
