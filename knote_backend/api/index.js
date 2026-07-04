// Vercel serverless entry point. Anything under api/ becomes a function;
// this one wraps the existing Express app so every request first ensures a
// MongoDB connection exists (connectDB() is cached — see src/config/db.js —
// so warm invocations don't reconnect) before delegating to Express routing.
require("dotenv").config({ quiet: true });

const { validateEnv } = require("../src/config/env");
const connectDB = require("../src/config/db");
const app = require("../src/app");

validateEnv();

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    res.status(503).json({ success: false, message: "Database unavailable", errors: [] });
    return;
  }
  app(req, res);
};
