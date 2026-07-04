import { create } from "zustand";
import { authApi } from "@/services/authApi";

// Module-level single-flight guard: concurrent 401s (and React StrictMode's
// double-invoked bootstrap effect) all await the SAME refresh call instead of
// firing several /refresh requests.
let refreshPromise = null;

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null, // in memory only — never persisted
  isAuthenticated: false,
  isLoading: true, // true until the first bootstrap() settles

  setAuth: ({ user, accessToken }) =>
    set({ user, accessToken, isAuthenticated: true }),

  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),

  login: async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    get().setAuth(data);
    return data.user;
  },

  signup: async ({ name, email, password }) => {
    // Backend auto-logs-in on register (returns user + accessToken).
    const data = await authApi.register({ name, email, password });
    get().setAuth(data);
    return data.user;
  },

  fetchMe: async () => {
    const { user } = await authApi.me();
    set({ user, isAuthenticated: true });
    return user;
  },

  // Returns the new access token, or throws. Deduplicated via refreshPromise.
  refresh: async () => {
    if (!refreshPromise) {
      refreshPromise = authApi
        .refresh()
        .then((data) => {
          get().setAuth(data);
          return data.accessToken;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
    return refreshPromise;
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the request fails, clear local state so the UI logs out.
    } finally {
      get().clearAuth();
    }
  },

  // Called once on app load: mint a fresh access token from the refresh
  // cookie, then hydrate the user. Any failure = not logged in.
  bootstrap: async () => {
    try {
      await get().refresh(); // sets user + token if the cookie is valid
    } catch {
      get().clearAuth();
    } finally {
      set({ isLoading: false });
    }
  },
}));
