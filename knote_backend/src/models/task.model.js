const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: [true, "Task text is required"],
      trim: true,
      maxlength: 200,
    },
    done: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
