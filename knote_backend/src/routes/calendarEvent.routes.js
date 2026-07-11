const express = require("express");
const calendarEventController = require("../controllers/calendarEvent.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const {
  createEventValidator,
  updateEventValidator,
  eventIdValidator,
} = require("../validators/calendarEvent.validator");

const router = express.Router();

router.use(protect); // all calendar event routes require auth

router.get("/", calendarEventController.listEvents);
router.post("/", createEventValidator, validate, calendarEventController.createEvent);
router.patch("/:id", updateEventValidator, validate, calendarEventController.updateEvent);
router.delete("/:id", eventIdValidator, validate, calendarEventController.deleteEvent);

module.exports = router;
