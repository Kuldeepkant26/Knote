const { body, param } = require("express-validator");

const TINTS = ["accent", "mauve", "success"];

const notebookIdParam = param("id").isMongoId().withMessage("Invalid notebook id");
const sectionIdParam = param("sectionId").isMongoId().withMessage("Invalid section id");

const createNotebookValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 80 }).withMessage("Title is too long"),
  body("subject").optional().trim().isLength({ max: 80 }).withMessage("Subject is too long"),
  body("tint").optional().isIn(TINTS).withMessage("Invalid tint"),
];

const updateNotebookValidator = [
  notebookIdParam,
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 80 }),
  body("subject").optional().trim().isLength({ max: 80 }),
  body("tint").optional().isIn(TINTS).withMessage("Invalid tint"),
];

const notebookIdValidator = [notebookIdParam];

const addSectionValidator = [
  notebookIdParam,
  body("title").trim().notEmpty().withMessage("Section title is required").isLength({ max: 80 }),
];

const updateSectionValidator = [
  notebookIdParam,
  sectionIdParam,
  body("title").optional().trim().notEmpty().withMessage("Section title cannot be empty").isLength({ max: 80 }),
  body("order").optional().isInt().withMessage("Order must be a number"),
];

const deleteSectionValidator = [notebookIdParam, sectionIdParam];

module.exports = {
  createNotebookValidator,
  updateNotebookValidator,
  notebookIdValidator,
  addSectionValidator,
  updateSectionValidator,
  deleteSectionValidator,
};
