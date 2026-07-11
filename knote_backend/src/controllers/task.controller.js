const asyncHandler = require("express-async-handler");
const taskService = require("../services/task.service");
const { sendSuccess } = require("../utils/apiResponse");

const listTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.listTasks(req.user._id);
  sendSuccess(res, 200, "Tasks fetched successfully", { tasks });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user._id, req.body);
  sendSuccess(res, 201, "Task created successfully", { task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.user._id, req.params.id, req.body);
  sendSuccess(res, 200, "Task updated successfully", { task });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.user._id, req.params.id);
  sendSuccess(res, 200, "Task deleted successfully");
});

module.exports = { listTasks, createTask, updateTask, deleteTask };
