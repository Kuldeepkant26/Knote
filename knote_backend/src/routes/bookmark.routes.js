const express = require("express");
const bookmarkController = require("../controllers/bookmark.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const {
  createBookmarkValidator,
  updateBookmarkValidator,
  bookmarkIdValidator,
} = require("../validators/bookmark.validator");

const router = express.Router();

router.use(protect); // all bookmark routes require auth

router.get("/", bookmarkController.listBookmarks);
router.post("/", createBookmarkValidator, validate, bookmarkController.createBookmark);
router.patch("/:id", updateBookmarkValidator, validate, bookmarkController.updateBookmark);
router.delete("/:id", bookmarkIdValidator, validate, bookmarkController.deleteBookmark);

module.exports = router;
