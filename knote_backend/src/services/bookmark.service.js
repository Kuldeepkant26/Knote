const Bookmark = require("../models/bookmark.model");
const { ApiError } = require("../utils/apiResponse");

async function listBookmarks(userId) {
  return Bookmark.find({ user: userId }).sort({ createdAt: -1 }).lean();
}

async function createBookmark(userId, { title, url, subject }) {
  const bookmark = await Bookmark.create({ user: userId, title, url, subject: subject || "" });
  return bookmark.toObject();
}

async function updateBookmark(userId, bookmarkId, updates) {
  const allowed = {};
  for (const key of ["title", "url", "subject"]) {
    if (updates[key] !== undefined) allowed[key] = updates[key];
  }
  const bookmark = await Bookmark.findOneAndUpdate(
    { _id: bookmarkId, user: userId },
    { $set: allowed },
    { new: true, runValidators: true }
  ).lean();
  if (!bookmark) throw new ApiError(404, "Bookmark not found");
  return bookmark;
}

async function deleteBookmark(userId, bookmarkId) {
  const bookmark = await Bookmark.findOneAndDelete({ _id: bookmarkId, user: userId });
  if (!bookmark) throw new ApiError(404, "Bookmark not found");
}

module.exports = { listBookmarks, createBookmark, updateBookmark, deleteBookmark };
