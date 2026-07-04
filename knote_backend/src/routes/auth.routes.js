const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimiter.middleware");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth.validator");

const router = express.Router();

router.post("/register", authLimiter, registerValidator, validate, authController.register);
router.post("/login", authLimiter, loginValidator, validate, authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.post("/forgot-password", authLimiter, forgotPasswordValidator, validate, authController.forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidator, validate, authController.resetPassword);

module.exports = router;
