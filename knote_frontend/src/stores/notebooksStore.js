import { create } from "zustand";
import { notebookApi } from "@/services/notebookApi";
import { pageApi } from "@/services/pageApi";

export const useNotebooksStore = create((set, get) => ({
  notebooks: [], // light list for the grid (with sectionCount/pageCount)
  listLoaded: false,
  listLoading: false,

  current: null, // full notebook (sections + light pages) for the detail view
  currentLoading: false,

  // --- List ---
  fetchNotebooks: async () => {
    set({ listLoading: true });
    try {
      const { notebooks } = await notebookApi.list();
      set({ notebooks, listLoaded: true });
    } finally {
      set({ listLoading: false });
    }
  },

  createNotebook: async (payload) => {
    const { notebook } = await notebookApi.create(payload);
    await get().fetchNotebooks();
    return notebook;
  },

  updateNotebook: async (id, payload) => {
    await notebookApi.update(id, payload);
    await get().fetchNotebooks();
    if (get().current?._id === id) await get().fetchNotebook(id);
  },

  deleteNotebook: async (id) => {
    await notebookApi.remove(id);
    set((s) => ({ notebooks: s.notebooks.filter((n) => n._id !== id) }));
  },

  // --- Detail ---
  fetchNotebook: async (id) => {
    set({ currentLoading: true });
    try {
      const { notebook } = await notebookApi.get(id);
      set({ current: notebook });
      return notebook;
    } finally {
      set({ currentLoading: false });
    }
  },

  clearCurrent: () => set({ current: null }),

  // --- Sections (refetch current) ---
  addSection: async (id, title) => {
    await notebookApi.addSection(id, { title });
    await get().fetchNotebook(id);
  },
  updateSection: async (id, sectionId, payload) => {
    await notebookApi.updateSection(id, sectionId, payload);
    await get().fetchNotebook(id);
  },
  deleteSection: async (id, sectionId) => {
    await notebookApi.removeSection(id, sectionId);
    await get().fetchNotebook(id);
  },

  // --- Pages (refetch current notebook so counts/list update) ---
  createPage: async ({ notebook, sectionId, title }) => {
    const { page } = await pageApi.create({ notebook, sectionId, title });
    await get().fetchNotebook(notebook);
    return page;
  },
  deletePage: async (pageId, notebookId) => {
    await pageApi.remove(pageId);
    if (notebookId) await get().fetchNotebook(notebookId);
  },
}));
