const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const pendingSignupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    otpHash: {
      type: String,
      required: true,
      select: false,
    },
    // TTL index: MongoDB automatically deletes the document once this time
    // passes, so abandoned signups clean themselves up with no cron job.
    otpExpires: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true }
);

pendingSignupSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("PendingSignup", pendingSignupSchema);
