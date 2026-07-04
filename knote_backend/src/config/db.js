const mongoose = require("mongoose");
const { env } = require("./env");

// Cached across invocations on a warm serverless instance (and harmless for
// a normal long-running server) so we don't reconnect on every request.
let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    mongoose.set("strictQuery", true);
    connectionPromise = mongoose.connect(env.mongoUrl).then((conn) => {
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
      return conn;
    }).catch((err) => {
      connectionPromise = null; // allow retry on the next request if this attempt failed
      throw err;
    });
  }

  return connectionPromise;
}

module.exports = connectDB;
