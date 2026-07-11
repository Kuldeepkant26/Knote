const express = require("express");
const authRoutes = require("./auth.routes");
const notebookRoutes = require("./notebook.routes");
const pageRoutes = require("./page.routes");
const transactionRoutes = require("./transaction.routes");
const taskRoutes = require("./task.routes");
const calendarEventRoutes = require("./calendarEvent.routes");
const bookmarkRoutes = require("./bookmark.routes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

router.use("/auth", authRoutes);
router.use("/notebooks", notebookRoutes);
router.use("/pages", pageRoutes);
router.use("/transactions", transactionRoutes);
router.use("/tasks", taskRoutes);
router.use("/calendar-events", calendarEventRoutes);
router.use("/bookmarks", bookmarkRoutes);

module.exports = router;
