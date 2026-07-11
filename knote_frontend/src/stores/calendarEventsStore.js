import { create } from "zustand";
import { calendarEventApi } from "@/services/calendarEventApi";

export const useCalendarEventsStore = create((set, get) => ({
  events: [],
  listLoaded: false,
  listLoading: false,

  fetchEvents: async () => {
    set({ listLoading: true });
    try {
      const { events } = await calendarEventApi.list();
      set({ events, listLoaded: true });
    } finally {
      set({ listLoading: false });
    }
  },

  createEvent: async (payload) => {
    const { event } = await calendarEventApi.create(payload);
    await get().fetchEvents();
    return event;
  },

  updateEvent: async (id, payload) => {
    await calendarEventApi.update(id, payload);
    await get().fetchEvents();
  },

  deleteEvent: async (id) => {
    await calendarEventApi.remove(id);
    set((s) => ({ events: s.events.filter((e) => e._id !== id) }));
  },
}));
