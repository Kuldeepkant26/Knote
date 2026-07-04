const express = require("express");
const authRoutes = require("./auth.routes");
const notebookRoutes = require("./notebook.routes");
const pageRoutes = require("./page.routes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

router.use("/auth", authRoutes);
router.use("/notebooks", notebookRoutes);
router.use("/pages", pageRoutes);

module.exports = router;
