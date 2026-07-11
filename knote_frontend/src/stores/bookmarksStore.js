import { create } from "zustand";
import { bookmarkApi } from "@/services/bookmarkApi";

export const useBookmarksStore = create((set, get) => ({
  bookmarks: [],
  listLoaded: false,
  listLoading: false,

  fetchBookmarks: async () => {
    set({ listLoading: true });
    try {
      const { bookmarks } = await bookmarkApi.list();
      set({ bookmarks, listLoaded: true });
    } finally {
      set({ listLoading: false });
    }
  },

  createBookmark: async (payload) => {
    const { bookmark } = await bookmarkApi.create(payload);
    await get().fetchBookmarks();
    return bookmark;
  },

  updateBookmark: async (id, payload) => {
    await bookmarkApi.update(id, payload);
    await get().fetchBookmarks();
  },

  deleteBookmark: async (id) => {
    await bookmarkApi.remove(id);
    set((s) => ({ bookmarks: s.bookmarks.filter((b) => b._id !== id) }));
  },
}));
