const CalendarEvent = require("../models/calendarEvent.model");
const { ApiError } = require("../utils/apiResponse");

async function listEvents(userId) {
  return CalendarEvent.find({ user: userId }).sort({ date: 1 }).lean();
}

async function createEvent(userId, { title, date, tone }) {
  const event = await CalendarEvent.create({ user: userId, title, date, tone: tone || "accent" });
  return event.toObject();
}

async function updateEvent(userId, eventId, updates) {
  const allowed = {};
  for (const key of ["title", "date", "tone"]) {
    if (updates[key] !== undefined) allowed[key] = updates[key];
  }
  const event = await CalendarEvent.findOneAndUpdate(
    { _id: eventId, user: userId },
    { $set: allowed },
    { new: true, runValidators: true }
  ).lean();
  if (!event) throw new ApiError(404, "Event not found");
  return event;
}

async function deleteEvent(userId, eventId) {
  const event = await CalendarEvent.findOneAndDelete({ _id: eventId, user: userId });
  if (!event) throw new ApiError(404, "Event not found");
}

module.exports = { listEvents, createEvent, updateEvent, deleteEvent };
