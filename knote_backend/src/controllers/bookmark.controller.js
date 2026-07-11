const asyncHandler = require("express-async-handler");
const bookmarkService = require("../services/bookmark.service");
const { sendSuccess } = require("../utils/apiResponse");

const listBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await bookmarkService.listBookmarks(req.user._id);
  sendSuccess(res, 200, "Bookmarks fetched successfully", { bookmarks });
});

const createBookmark = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.createBookmark(req.user._id, req.body);
  sendSuccess(res, 201, "Bookmark created successfully", { bookmark });
});

const updateBookmark = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.updateBookmark(req.user._id, req.params.id, req.body);
  sendSuccess(res, 200, "Bookmark updated successfully", { bookmark });
});

const deleteBookmark = asyncHandler(async (req, res) => {
  await bookmarkService.deleteBookmark(req.user._id, req.params.id);
  sendSuccess(res, 200, "Bookmark deleted successfully");
});

module.exports = { listBookmarks, createBookmark, updateBookmark, deleteBookmark };
