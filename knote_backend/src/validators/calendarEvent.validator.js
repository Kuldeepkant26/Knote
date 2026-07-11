const { body, param } = require("express-validator");
const { TONES } = require("../models/calendarEvent.model");

const eventIdParam = param("id").isMongoId().withMessage("Invalid event id");

const createEventValidator = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 120 }),
  body("date").isISO8601().withMessage("Invalid date"),
  body("tone").optional().isIn(TONES).withMessage("Invalid tone"),
];

const updateEventValidator = [
  eventIdParam,
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty").isLength({ max: 120 }),
  body("date").optional().isISO8601().withMessage("Invalid date"),
  body("tone").optional().isIn(TONES).withMessage("Invalid tone"),
];

const eventIdValidator = [eventIdParam];

module.exports = { createEventValidator, updateEventValidator, eventIdValidator };
