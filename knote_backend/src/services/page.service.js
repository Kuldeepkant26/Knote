const Notebook = require("../models/notebook.model");
const Page = require("../models/page.model");
const { ApiError } = require("../utils/apiResponse");
const { tiptapToPreview } = require("../utils/tiptapText");

async function getPage(userId, pageId) {
  const page = await Page.findOne({ _id: pageId, user: userId }).lean();
  if (!page) throw new ApiError(404, "Page not found");
  return page;
}

async function createPage(userId, { notebook, sectionId, title }) {
  // Verify the notebook belongs to the user and the section exists.
  const nb = await Notebook.findOne({ _id: notebook, user: userId });
  if (!nb) throw new ApiError(404, "Notebook not found");
  if (!nb.sections.id(sectionId)) throw new ApiError(404, "Section not found");

  const count = await Page.countDocuments({ notebook, sectionId, user: userId });

  const page = await Page.create({
    user: userId,
    notebook,
    sectionId,
    title: title || "Untitled page",
    order: count,
  });
  return page.toObject();
}

async function updatePage(userId, pageId, updates) {
  const allowed = {};
  for (const key of ["title", "background", "defaultFont", "order", "sectionId"]) {
    if (updates[key] !== undefined) allowed[key] = updates[key];
  }
  // Content is Mixed; recompute the preview whenever it changes.
  if (updates.content !== undefined) {
    allowed.content = updates.content;
    allowed.preview = tiptapToPreview(updates.content);
  }

  const page = await Page.findOneAndUpdate(
    { _id: pageId, user: userId },
    { $set: allowed },
    { new: true, runValidators: true }
  ).lean();
  if (!page) throw new ApiError(404, "Page not found");
  return page;
}

async function deletePage(userId, pageId) {
  const page = await Page.findOneAndDelete({ _id: pageId, user: userId });
  if (!page) throw new ApiError(404, "Page not found");
}

module.exports = { getPage, createPage, updatePage, deletePage };
