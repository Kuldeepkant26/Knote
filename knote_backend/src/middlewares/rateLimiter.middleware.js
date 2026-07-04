const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts, please try again later",
    errors: [],
  },
});

// Tighter limit for resending OTPs — this sends an email per request, so it
// needs stricter throttling than general auth attempts to avoid being used
// as a way to spam someone's inbox.
const otpResendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 4,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many code requests, please wait before trying again",
    errors: [],
  },
});

module.exports = { authLimiter, otpResendLimiter };
