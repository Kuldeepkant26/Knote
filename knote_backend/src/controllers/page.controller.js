const asyncHandler = require("express-async-handler");
const pageService = require("../services/page.service");
const { sendSuccess } = require("../utils/apiResponse");

const getPage = asyncHandler(async (req, res) => {
  const page = await pageService.getPage(req.user._id, req.params.id);
  sendSuccess(res, 200, "Page fetched successfully", { page });
});

const createPage = asyncHandler(async (req, res) => {
  const page = await pageService.createPage(req.user._id, req.body);
  sendSuccess(res, 201, "Page created successfully", { page });
});

const updatePage = asyncHandler(async (req, res) => {
  const page = await pageService.updatePage(req.user._id, req.params.id, req.body);
  sendSuccess(res, 200, "Page updated successfully", { page });
});

const deletePage = asyncHandler(async (req, res) => {
  await pageService.deletePage(req.user._id, req.params.id);
  sendSuccess(res, 200, "Page deleted successfully");
});

module.exports = { getPage, createPage, updatePage, deletePage };
