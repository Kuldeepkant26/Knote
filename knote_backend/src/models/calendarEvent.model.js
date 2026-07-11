const mongoose = require("mongoose");

const TONES = ["accent", "mauve", "success"];

const calendarEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    tone: {
      type: String,
      enum: TONES,
      default: "accent",
    },
  },
  { timestamps: true }
);

calendarEventSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
module.exports.TONES = TONES;
