const mongoose = require("mongoose");

const CATEGORIES = ["Food", "Utilities", "Entertainment", "Education", "Income", "Transport", "Health", "Other"];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: "Other",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"], // positive = income, negative = expense
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
module.exports.CATEGORIES = CATEGORIES;
