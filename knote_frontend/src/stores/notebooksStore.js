import { create } from "zustand";
import { notebookApi } from "@/services/notebookApi";
import { pageApi } from "@/services/pageApi";

// Cache-first (stale-while-revalidate): cached data renders instantly while
// fresh data is fetched in the background. Skeletons only show on cold loads.
export const useNotebooksStore = create((set, get) => ({
  notebooks: [], // light list for the grid (with sectionCount/pageCount)
  listLoaded: false,
  listLoading: false,

  current: null, // full notebook (sections + light pages) for the detail view
  currentId: null,
  currentLoading: false,

  notebookCache: {}, // id -> full notebook, kept across navigations
  pageCache: {}, // pageId -> full page (content), for the editor

  recentPages: [],
  recentPagesLoaded: false,

  // --- List ---
  fetchNotebooks: async () => {
    if (get().listLoading) return;
    const hasCache = get().listLoaded;
    if (!hasCache) set({ listLoading: true });
    try {
      const { notebooks } = await notebookApi.list();
      set({ notebooks, listLoaded: true });
    } catch (err) {
      if (!hasCache) throw err; // silent when we already show cached data
    } finally {
      if (!hasCache) set({ listLoading: false });
    }
  },

  createNotebook: async (payload) => {
    const { notebook } = await notebookApi.create(payload);
    await get().fetchNotebooks();
    return notebook;
  },

  updateNotebook: async (id, payload) => {
    await notebookApi.update(id, payload);
    // Patch caches locally so the rename shows everywhere without a refetch flash.
    set((s) => {
      const cached = s.notebookCache[id];
      const next = cached ? { ...cached, ...payload } : null;
      return {
        notebooks: s.notebooks.map((n) => (n._id === id ? { ...n, ...payload } : n)),
        notebookCache: next ? { ...s.notebookCache, [id]: next } : s.notebookCache,
        current: s.current?._id === id && next ? next : s.current,
      };
    });
    get().fetchNotebooks();
  },

  // --- Detail ---
  // Fetch + cache a notebook without touching the detail-view state
  // (used by the page editor for its breadcrumb).
  loadNotebook: async (id) => {
    const { notebook } = await notebookApi.get(id);
    set((s) => ({ notebookCache: { ...s.notebookCache, [id]: notebook } }));
    return notebook;
  },

  fetchNotebook: async (id) => {
    const cached = get().notebookCache[id];
    set({ currentId: id, current: cached || null, currentLoading: !cached });
    try {
      const notebook = await get().loadNotebook(id);
      set((s) => (s.currentId === id ? { current: notebook, currentLoading: false } : {}));
      return notebook;
    } catch (err) {
      set((s) => (s.currentId === id ? { currentLoading: false } : {}));
      if (!cached) throw err;
      return cached;
    }
  },

  clearCurrent: () => set({ current: null, currentId: null }),

  // --- Sections (refetch current) ---
  addSection: async (id, title) => {
    await notebookApi.addSection(id, { title });
    await get().fetchNotebook(id);
  },
  updateSection: async (id, sectionId, payload) => {
    await notebookApi.updateSection(id, sectionId, payload);
    await get().fetchNotebook(id);
  },

  // --- Pages ---
  createPage: async (payload) => {
    const { page } = await pageApi.create(payload);
    // Seed the cache so the editor opens instantly after navigation.
    set((s) => ({ pageCache: { ...s.pageCache, [page._id]: page } }));
    await get().fetchNotebook(payload.notebook);
    return page;
  },

  fetchPage: async (pageId) => {
    const { page } = await pageApi.get(pageId);
    let result = page;
    set((s) => {
      const cached = s.pageCache[pageId];
      // Don't let a slow response overwrite content autosaved while it was in flight.
      if (cached && new Date(cached.updatedAt) > new Date(page.updatedAt)) {
        result = cached;
        return {};
      }
      return { pageCache: { ...s.pageCache, [pageId]: page } };
    });
    return result;
  },

  // Keep the cached copy in sync with autosaved edits.
  updatePageCache: (pageId, patch) =>
    set((s) => {
      const cached = s.pageCache[pageId];
      if (!cached) return {};
      return {
        pageCache: {
          ...s.pageCache,
          [pageId]: { ...cached, ...patch, updatedAt: new Date().toISOString() },
        },
      };
    }),

  // --- Recent pages (dashboard home) ---
  fetchRecentPages: async () => {
    const hasCache = get().recentPagesLoaded;
    try {
      const { pages } = await pageApi.recent();
      set({ recentPages: pages, recentPagesLoaded: true });
    } catch (err) {
      if (!hasCache) throw err;
    }
  },
}));
