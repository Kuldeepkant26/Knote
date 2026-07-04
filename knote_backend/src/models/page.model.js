const mongoose = require("mongoose");

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] };

const BACKGROUNDS = [
  "ruled-cream",
  "ruled-white",
  "grid",
  "dotted",
  "plain-cream",
  "plain-white",
];

const pageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
      index: true,
    },
    // Refers to the embedded section's _id inside the notebook.
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Untitled page",
    },
    // TipTap JSON document.
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ ...EMPTY_DOC }),
    },
    background: {
      type: String,
      enum: BACKGROUNDS,
      default: "ruled-cream",
    },
    defaultFont: {
      type: String,
      default: "Kalam",
    },
    // Server-extracted plain text for card snippets.
    preview: {
      type: String,
      default: "",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

pageSchema.index({ notebook: 1, sectionId: 1, order: 1 });

module.exports = mongoose.model("Page", pageSchema);
module.exports.BACKGROUNDS = BACKGROUNDS;
module.exports.EMPTY_DOC = EMPTY_DOC;
