const Task = require("../models/task.model");
const { ApiError } = require("../utils/apiResponse");

async function listTasks(userId) {
  return Task.find({ user: userId }).sort({ dueDate: 1, createdAt: -1 }).lean();
}

async function createTask(userId, { text, dueDate }) {
  const task = await Task.create({ user: userId, text, dueDate });
  return task.toObject();
}

async function updateTask(userId, taskId, updates) {
  const allowed = {};
  for (const key of ["text", "done", "dueDate"]) {
    if (updates[key] !== undefined) allowed[key] = updates[key];
  }
  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    { $set: allowed },
    { new: true, runValidators: true }
  ).lean();
  if (!task) throw new ApiError(404, "Task not found");
  return task;
}

async function deleteTask(userId, taskId) {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) throw new ApiError(404, "Task not found");
}

module.exports = { listTasks, createTask, updateTask, deleteTask };
