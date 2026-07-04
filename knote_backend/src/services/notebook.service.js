const mongoose = require("mongoose");
const Notebook = require("../models/notebook.model");
const Page = require("../models/page.model");
const { ApiError } = require("../utils/apiResponse");

// --- Notebooks -------------------------------------------------------

async function listNotebooks(userId) {
  const notebooks = await Notebook.find({ user: userId }).sort({ order: 1, createdAt: 1 }).lean();

  // Page counts per notebook in one aggregation.
  const counts = await Page.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$notebook", count: { $sum: 1 } } },
  ]);
  const pageCountMap = new Map(counts.map((c) => [String(c._id), c.count]));

  return notebooks.map((nb) => ({
    ...nb,
    sectionCount: nb.sections.length,
    pageCount: pageCountMap.get(String(nb._id)) || 0,
  }));
}

async function getNotebook(userId, notebookId) {
  const notebook = await Notebook.findOne({ _id: notebookId, user: userId }).lean();
  if (!notebook) throw new ApiError(404, "Notebook not found");

  // Light page list (no content) for the detail view.
  const pages = await Page.find({ notebook: notebookId, user: userId })
    .select("title sectionId preview background order updatedAt")
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return { ...notebook, pages };
}

async function createNotebook(userId, { title, subject, tint }) {
  const notebook = await Notebook.create({
    user: userId,
    title,
    subject: subject || "",
    tint: tint || "accent",
    sections: [{ title: "General", order: 0 }],
  });
  return notebook.toObject();
}

async function updateNotebook(userId, notebookId, updates) {
  const allowed = {};
  for (const key of ["title", "subject", "tint", "order"]) {
    if (updates[key] !== undefined) allowed[key] = updates[key];
  }
  const notebook = await Notebook.findOneAndUpdate(
    { _id: notebookId, user: userId },
    { $set: allowed },
    { new: true, runValidators: true }
  ).lean();
  if (!notebook) throw new ApiError(404, "Notebook not found");
  return notebook;
}

async function deleteNotebook(userId, notebookId) {
  const notebook = await Notebook.findOneAndDelete({ _id: notebookId, user: userId });
  if (!notebook) throw new ApiError(404, "Notebook not found");
  await Page.deleteMany({ notebook: notebookId, user: userId }); // cascade
}

// --- Sections (embedded) --------------------------------------------

async function addSection(userId, notebookId, { title }) {
  const notebook = await Notebook.findOne({ _id: notebookId, user: userId });
  if (!notebook) throw new ApiError(404, "Notebook not found");

  notebook.sections.push({ title, order: notebook.sections.length });
  await notebook.save();
  return notebook.toObject();
}

async function updateSection(userId, notebookId, sectionId, updates) {
  const notebook = await Notebook.findOne({ _id: notebookId, user: userId });
  if (!notebook) throw new ApiError(404, "Notebook not found");

  const section = notebook.sections.id(sectionId);
  if (!section) throw new ApiError(404, "Section not found");

  if (updates.title !== undefined) section.title = updates.title;
  if (updates.order !== undefined) section.order = updates.order;
  await notebook.save();
  return notebook.toObject();
}

async function deleteSection(userId, notebookId, sectionId) {
  const notebook = await Notebook.findOne({ _id: notebookId, user: userId });
  if (!notebook) throw new ApiError(404, "Notebook not found");

  const section = notebook.sections.id(sectionId);
  if (!section) throw new ApiError(404, "Section not found");

  section.deleteOne();
  await notebook.save();
  await Page.deleteMany({ notebook: notebookId, sectionId, user: userId }); // cascade
  return notebook.toObject();
}

module.exports = {
  listNotebooks,
  getNotebook,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  addSection,
  updateSection,
  deleteSection,
};
