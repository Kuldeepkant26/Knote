import { api } from "@/lib/apiClient";

export const calendarEventApi = {
  list: () => api.get("/calendar-events"), // { events }
  create: (payload) => api.post("/calendar-events", payload), // { event }
  update: (id, payload) => api.patch(`/calendar-events/${id}`, payload),
  remove: (id) => api.del(`/calendar-events/${id}`),
};
