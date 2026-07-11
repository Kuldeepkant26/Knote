const { body, param } = require("express-validator");

const bookmarkIdParam = param("id").isMongoId().withMessage("Invalid bookmark id");

const createBookmarkValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 120 }),
  body("url")
    .trim()
    .notEmpty()
    .withMessage("URL is required")
    .isURL({ require_protocol: false })
    .withMessage("Invalid URL")
    .isLength({ max: 500 }),
  body("subject").optional().trim().isLength({ max: 80 }).withMessage("Subject is too long"),
];

const updateBookmarkValidator = [
  bookmarkIdParam,
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 120 }),
  body("url")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("URL cannot be empty")
    .isURL({ require_protocol: false })
    .withMessage("Invalid URL")
    .isLength({ max: 500 }),
  body("subject").optional().trim().isLength({ max: 80 }).withMessage("Subject is too long"),
];

const bookmarkIdValidator = [bookmarkIdParam];

module.exports = { createBookmarkValidator, updateBookmarkValidator, bookmarkIdValidator };
