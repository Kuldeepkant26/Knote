const asyncHandler = require("express-async-handler");
const notebookService = require("../services/notebook.service");
const { sendSuccess } = require("../utils/apiResponse");

const listNotebooks = asyncHandler(async (req, res) => {
  const notebooks = await notebookService.listNotebooks(req.user._id);
  sendSuccess(res, 200, "Notebooks fetched successfully", { notebooks });
});

const getNotebook = asyncHandler(async (req, res) => {
  const notebook = await notebookService.getNotebook(req.user._id, req.params.id);
  sendSuccess(res, 200, "Notebook fetched successfully", { notebook });
});

const createNotebook = asyncHandler(async (req, res) => {
  const notebook = await notebookService.createNotebook(req.user._id, req.body);
  sendSuccess(res, 201, "Notebook created successfully", { notebook });
});

const updateNotebook = asyncHandler(async (req, res) => {
  const notebook = await notebookService.updateNotebook(req.user._id, req.params.id, req.body);
  sendSuccess(res, 200, "Notebook updated successfully", { notebook });
});

const deleteNotebook = asyncHandler(async (req, res) => {
  await notebookService.deleteNotebook(req.user._id, req.params.id);
  sendSuccess(res, 200, "Notebook deleted successfully");
});

const addSection = asyncHandler(async (req, res) => {
  const notebook = await notebookService.addSection(req.user._id, req.params.id, req.body);
  sendSuccess(res, 201, "Section added successfully", { notebook });
});

const updateSection = asyncHandler(async (req, res) => {
  const notebook = await notebookService.updateSection(
    req.user._id,
    req.params.id,
    req.params.sectionId,
    req.body
  );
  sendSuccess(res, 200, "Section updated successfully", { notebook });
});

const deleteSection = asyncHandler(async (req, res) => {
  const notebook = await notebookService.deleteSection(
    req.user._id,
    req.params.id,
    req.params.sectionId
  );
  sendSuccess(res, 200, "Section deleted successfully", { notebook });
});

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
