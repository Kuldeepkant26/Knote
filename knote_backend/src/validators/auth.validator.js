const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
];

const verifyOtpValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("otp").trim().notEmpty().withMessage("Verification code is required").isLength({ min: 6, max: 6 }).withMessage("Enter the 6-digit code").isNumeric().withMessage("Code must be numeric"),
];

const resendOtpValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
];

const loginValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidator = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
];

const resetPasswordValidator = [
  body("token").trim().notEmpty().withMessage("Reset token is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
];

module.exports = {
  registerValidator,
  verifyOtpValidator,
  resendOtpValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
