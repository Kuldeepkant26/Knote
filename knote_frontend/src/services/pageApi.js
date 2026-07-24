import { api } from "@/lib/apiClient";

export const pageApi = {
  get: (id) => api.get(`/pages/${id}`), // { page } full content
  recent: () => api.get("/pages/recent"), // { pages } across all notebooks
  create: (payload) => api.post("/pages", payload), // { page }
  update: (id, payload) => api.patch(`/pages/${id}`, payload), // autosave
};
