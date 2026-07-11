const Transaction = require("../models/transaction.model");
const { ApiError } = require("../utils/apiResponse");

async function listTransactions(userId) {
  return Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 }).lean();
}

async function createTransaction(userId, { description, category, amount, date }) {
  const txn = await Transaction.create({
    user: userId,
    description,
    category: category || "Other",
    amount,
    date,
  });
  return txn.toObject();
}

async function updateTransaction(userId, txnId, updates) {
  const allowed = {};
  for (const key of ["description", "category", "amount", "date"]) {
    if (updates[key] !== undefined) allowed[key] = updates[key];
  }
  const txn = await Transaction.findOneAndUpdate(
    { _id: txnId, user: userId },
    { $set: allowed },
    { new: true, runValidators: true }
  ).lean();
  if (!txn) throw new ApiError(404, "Transaction not found");
  return txn;
}

async function deleteTransaction(userId, txnId) {
  const txn = await Transaction.findOneAndDelete({ _id: txnId, user: userId });
  if (!txn) throw new ApiError(404, "Transaction not found");
}

module.exports = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
