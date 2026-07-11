const { body, param } = require("express-validator");

const taskIdParam = param("id").isMongoId().withMessage("Invalid task id");

const createTaskValidator = [
  body("text").trim().notEmpty().withMessage("Task text is required").isLength({ max: 200 }),
  body("dueDate").isISO8601().withMessage("Invalid due date"),
];

const updateTaskValidator = [
  taskIdParam,
  body("text").optional().trim().notEmpty().withMessage("Task text cannot be empty").isLength({ max: 200 }),
  body("done").optional().isBoolean().withMessage("done must be a boolean"),
  body("dueDate").optional().isISO8601().withMessage("Invalid due date"),
];

const taskIdValidator = [taskIdParam];

module.exports = { createTaskValidator, updateTaskValidator, taskIdValidator };
