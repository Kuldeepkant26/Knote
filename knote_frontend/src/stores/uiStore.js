import { create } from "zustand";
import { persist } from "zustand/middleware";

// Sidebar collapse preference. Non-sensitive UI state, so persisting to
// localStorage is fine (contrast the auth token, which must never persist).
export const useUiStore = create(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebar: (v) => set({ sidebarCollapsed: v }),
    }),
    { name: "knote-ui" }
  )
);
