const asyncHandler = require("express-async-handler");
const transactionService = require("../services/transaction.service");
const { sendSuccess } = require("../utils/apiResponse");

const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionService.listTransactions(req.user._id);
  sendSuccess(res, 200, "Transactions fetched successfully", { transactions });
});

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.createTransaction(req.user._id, req.body);
  sendSuccess(res, 201, "Transaction created successfully", { transaction });
});

const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateTransaction(req.user._id, req.params.id, req.body);
  sendSuccess(res, 200, "Transaction updated successfully", { transaction });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  await transactionService.deleteTransaction(req.user._id, req.params.id);
  sendSuccess(res, 200, "Transaction deleted successfully");
});

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
