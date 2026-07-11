const { body, param } = require("express-validator");
const { CATEGORIES } = require("../models/transaction.model");

const transactionIdParam = param("id").isMongoId().withMessage("Invalid transaction id");

const createTransactionValidator = [
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 120 })
    .withMessage("Description is too long"),
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category"),
  body("amount")
    .isFloat()
    .withMessage("Amount must be a number")
    .not()
    .equals("0")
    .withMessage("Amount cannot be zero"),
  body("date").isISO8601().withMessage("Invalid date"),
];

const updateTransactionValidator = [
  transactionIdParam,
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty").isLength({ max: 120 }),
  body("category").optional().isIn(CATEGORIES).withMessage("Invalid category"),
  body("amount").optional().isFloat().withMessage("Amount must be a number").not().equals("0").withMessage("Amount cannot be zero"),
  body("date").optional().isISO8601().withMessage("Invalid date"),
];

const transactionIdValidator = [transactionIdParam];

module.exports = {
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
};
