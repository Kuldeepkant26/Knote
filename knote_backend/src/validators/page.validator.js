const { body, param } = require("express-validator");
const { BACKGROUNDS } = require("../models/page.model");

const pageIdParam = param("id").isMongoId().withMessage("Invalid page id");

const createPageValidator = [
  body("notebook").isMongoId().withMessage("Invalid notebook id"),
  body("sectionId").isMongoId().withMessage("Invalid section id"),
  body("title").optional().trim().isLength({ max: 120 }).withMessage("Title is too long"),
];

const updatePageValidator = [
  pageIdParam,
  body("title").optional().trim().isLength({ max: 120 }).withMessage("Title is too long"),
  body("content").optional().isObject().withMessage("Content must be a valid document"),
  body("background").optional().isIn(BACKGROUNDS).withMessage("Invalid background"),
  body("defaultFont").optional().isString().isLength({ max: 60 }),
  body("order").optional().isInt().withMessage("Order must be a number"),
  body("sectionId").optional().isMongoId().withMessage("Invalid section id"),
];

const pageIdValidator = [pageIdParam];

module.exports = { createPageValidator, updatePageValidator, pageIdValidator };
