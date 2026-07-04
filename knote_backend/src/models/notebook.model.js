const mongoose = require("mongoose");

// Sections are embedded: they're few per notebook and always loaded with it.
const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
      maxlength: 80,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const notebookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Notebook title is required"],
      trim: true,
      maxlength: 80,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    tint: {
      type: String,
      enum: ["accent", "mauve", "success"],
      default: "accent",
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notebook", notebookSchema);
