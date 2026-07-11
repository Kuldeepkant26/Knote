const express = require("express");
const taskController = require("../controllers/task.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const { createTaskValidator, updateTaskValidator, taskIdValidator } = require("../validators/task.validator");

const router = express.Router();

router.use(protect); // all task routes require auth

router.get("/", taskController.listTasks);
router.post("/", createTaskValidator, validate, taskController.createTask);
router.patch("/:id", updateTaskValidator, validate, taskController.updateTask);
router.delete("/:id", taskIdValidator, validate, taskController.deleteTask);

module.exports = router;
