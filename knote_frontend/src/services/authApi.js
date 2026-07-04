import { api } from "@/lib/apiClient";

// Semantic wrappers over the API client so stores/screens never hardcode paths.
// Each returns the `data` object from the backend's success envelope.
export const authApi = {
  register: (payload) => api.post("/auth/register", payload), // { user, accessToken }
  login: (payload) => api.post("/auth/login", payload), // { user, accessToken }
  refresh: () => api.post("/auth/refresh"), // { user, accessToken }
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"), // { user }
  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
};
