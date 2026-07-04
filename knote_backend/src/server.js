require("dotenv").config({ quiet: true });

const { validateEnv, env } = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

validateEnv();

let server;

async function start() {
  await connectDB();
  server = app.listen(env.port, () => {
    console.log(`Knote API running in ${env.nodeEnv} mode on port ${env.port}`);
  });
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server?.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server?.close(() => process.exit(0));
});

start();
