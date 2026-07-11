const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const {
  createTransactionValidator,
  updateTransactionValidator,
  transactionIdValidator,
} = require("../validators/transaction.validator");

const router = express.Router();

router.use(protect); // all transaction routes require auth

router.get("/", transactionController.listTransactions);
router.post("/", createTransactionValidator, validate, transactionController.createTransaction);
router.patch("/:id", updateTransactionValidator, validate, transactionController.updateTransaction);
router.delete("/:id", transactionIdValidator, validate, transactionController.deleteTransaction);

module.exports = router;
