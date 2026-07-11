const asyncHandler = require("express-async-handler");
const calendarEventService = require("../services/calendarEvent.service");
const { sendSuccess } = require("../utils/apiResponse");

const listEvents = asyncHandler(async (req, res) => {
  const events = await calendarEventService.listEvents(req.user._id);
  sendSuccess(res, 200, "Events fetched successfully", { events });
});

const createEvent = asyncHandler(async (req, res) => {
  const event = await calendarEventService.createEvent(req.user._id, req.body);
  sendSuccess(res, 201, "Event created successfully", { event });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await calendarEventService.updateEvent(req.user._id, req.params.id, req.body);
  sendSuccess(res, 200, "Event updated successfully", { event });
});

const deleteEvent = asyncHandler(async (req, res) => {
  await calendarEventService.deleteEvent(req.user._id, req.params.id);
  sendSuccess(res, 200, "Event deleted successfully");
});

module.exports = { listEvents, createEvent, updateEvent, deleteEvent };
